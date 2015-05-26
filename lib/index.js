'use strict';

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;
var crypto = require('crypto');

var HydrationError = require('anyfetch-hydrater').HydrationError;


/**
 * HYDRATING FUNCTION
 *
 * @param {string} path Path of the specified file
 * @param {string} original document
 * @param {object} changes object provided by anyFetch's API. Update this object to send document's modification to anyFetch's API.
 * @param {function} cb Callback, first parameter is the error if any, then the processed data
 */
module.exports = function hydratePdf(path, document, changes, next) {
  var outfolder = '/tmp/' + crypto.randomBytes(20).toString('hex') + '/';

  async.waterfall([
    function(cb) {
      fs.mkdir(outfolder, cb);
    },
    function(cb) {
      shellExec('convert ' + path + ' ' + outfolder + '%04d' + '.png', function(err, stdout, stderr) {
        if(err) {
          return cb(new HydrationError([err, stdout, stderr]));
        }
        cb();
      });
    },
    function(cb) {
      fs.readdir(outfolder, cb);
    },
    function(outputFiles, cb) {
      async.mapLimit(outputFiles, process.env.TESSERACT_PARALLEL || 2, function(file, cb) {
        shellExec('tesseract ' + outfolder + file + ' ' + outfolder + file, function(err, stdout, stderr) {
          if(err) {
            return cb(new HydrationError([err, stderr, stdout]));
          }
          else {
            cb(null, outfolder + file + '.txt');
          }
        });
      }, cb);
    },
    function(textFiles, cb) {
      async.map(textFiles, function(file, cb) {
        fs.readFile(file, function(err, res) {
          if(err) {
            return (cb(new HydrationError(err)));
          }
          else {
            cb(null, res.toString());
          }
        });
      }, cb);
    }, function(res, cb) {
      changes.metadata.text = res.join('');
      cb(null, changes);
    }], next);
};
