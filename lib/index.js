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
 module.exports = function(path, document, changes, cb) {
 	async.waterfall([
 		function(cb) {

 },
 ], function(err) {
 	cb(err, changes);
 });
 };
