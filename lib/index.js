'use strict';

var fs = require('fs');
var async = require('async');
var shellExec = require('child_process').exec;
var crypto = require('crypto');

var config = require('../config/configuration.js');
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
    var outfile = crypto.randomBytes(5).toString('hex');
    var outfolder = '/tmp/' + crypto.randomBytes(20).toString('hex');

 	async.waterfall([
    function(cb) {
        fs.mkdir(outfolder, cb);
    }, function(cb) {
 		var options = [
        '-density 200', // To sharpen the image
        ];
        shellExec('convert ' + path + ' ' + '/tmp/' + outfile + '.png', cb);
    },
    function(stdout, stderr, cb) {
        var outputFiles = [];
        fs.readdir('/tmp/', function(err, res){
            outputFiles = res.filter(function(elem){
                if (elem.indexOf(outfile) > -1)
                    return elem;
            });
        cb(null, outputFiles);
        });
    },
    function(outputFiles, cb) {
    	async.map(outputFiles, function(file, cb) {
    		shellExec('tesseract ' + '/tmp/' + file + ' ' + '/tmp/' + file, function(err, stdout, stderr) {
    			if (err) {
    				return cb(new HydrationError([err, stderr, stdout]));
    			} else {
    				cb(null, '/tmp/' + file + '.txt');
    			}
    		});
    	}, cb);
    },
    function(textFiles, cb) {
    	var fileContent = [];
    	async.map(textFiles, function(file, cb) {
    		fs.readFile(file, function(err, res) {
    			if (err) {
    				return (cb(new HydrationError(err)));
    			} else {
    				cb(null, res.toString());
    			}
    		});
    	}, cb);
    }], 
    function(err, res){
        if (err || !res) return next(new HydrationError(err), changes);
        changes.metadata = res.join('');
    	next(err, changes);
    });
};
