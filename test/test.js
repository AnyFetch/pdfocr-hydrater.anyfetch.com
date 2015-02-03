'use strict';

require('should');
var anyfetchHydrater = require('anyfetch-hydrater');
var fs = require('fs');

var pdfocr = require('../lib/');
var HydrationError = anyfetchHydrater.HydrationError;

describe('Test PDFOCR results', function() {
  it('returns the correct informations', function(done) {
      var document = {
          datas: {}
      };

      var changes = anyfetchHydrater.defaultChanges();
      pdfocr(__dirname + "/samples/test.pdf", document, changes, function(err, changes) {
          if(err) {
            throw err;
          }
          var data = fs.readFileSync(__dirname + '/samples/dump.txt');
          changes.metadata.should.eql(data.toString());
          done();
        });
    });

  it('should return an errored document', function(done) {
    var document = {
      data: {}
    };

    var changes = anyfetchHydrater.defaultChanges();
    pdfocr(__dirname + "/samples/bad.pdf", document, changes, function(err) {
      if(err instanceof HydrationError) {
        done();
      }
      else {
        done(new Error("invalid error"));
      }
    });
  });
});
