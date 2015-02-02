'use strict';

require('should');
var anyfetchHydrater = require('anyfetch-hydrater');
var pdfocr = require('../lib/');

describe('Test HYDRATER results', function() {
	it('returns the correct informations', function(done) {
		var document = {
			datas: {}
		};

		var changes = anyfetchHydrater.defaultChanges();

		pdfocr(__dirname + "./test.pdf", document, changes, function(err, changes){
			if (err){
				throw err;
			} 
		});
		done();
	});
});
