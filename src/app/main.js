require.config({
  urlArgs: "bust=" +  (new Date()).getTime(),
  paths: {
    'hogan' : 'vendor/hogan',
    'text' : 'vendor/text',
    'hgn' : 'vendor/hgn',
    'signals' : 'vendor/signals'
  },
  packages: [],
	shim: {}
});

//A Comment
var sharedApp = sharedApp || {};

define(function (require, exports, module) {
  require('service/native');
  var Application = require('application');
  sharedApp = Application.shared();
  sharedApp.initialize();

});
