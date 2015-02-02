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

 module.exports = function(path, document, changes, callback) {
 	async.waterfall([
 		function(cb) {
 			var outfile = crypto.randomBytes(20).toString('hex');
 			var options = [
        '-density 200', // To sharpen the image
        ];
        shellExec('convert ' + path + ' ' + '/tmp/' + outfile + '.png', function(err, stdout, stderr) {
        	if(err) {
        		return cb(new HydrationError([err, stderr, stdout]));
        	} else {
        		var outputFiles = [];
        		fs.readdir('/tmp/', function(err, res){
        			for (var i = 0; i < res.length; i++){
        				if (res[i].indexOf(outfile) > -1){
        					outputFiles.push(res[i]);
        				}
        			}
        		});
        		cb(null, outputFiles);
        	}
        });
    },
    function(outputFiles, cb) {
    	async.map(outputFiles, function(file, cb){
    		shellExec('tesseract ' + '/tmp/' + file + ' ' + '/tmp/' + file, function(err, stdout, stderr) {
    			if (err) {
    				return cb(new HydrationError([err, stderr, stdout]));
    			} else {
    				cb(null, outputFiles);
    			}
    		});
    	}, function(err, res) {
    		cb(err, res);
    	});
    },
    function(outputFiles, cb) {
    	var fileContent = [];
    	async.map(outputFiles[0], function(file, cb) {
    		fs.readFile('/tmp/' + file + '.txt', function(err, res){
    			if (err) {
    				return (cb(new HydrationError(err)));
    			} else {
    				cb(null, res.toString());
    			}
    		});
    	}, function(err, res) {
    		cb(err, res);
    	});
    }], function(err, res){
    	callback();
    });
};
