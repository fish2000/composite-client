define(function (require, exports, module) {

  var signals = require('signals');

  var _ticking = false;
  var _tickDelay = 250;
  var windowWidth = 0;
  var windowHeight = 0;
  var timeoutId = null;

  var self;

  var DKResizer = function() {
    this.onUpdate = new signals.Signal();
    self = this;
  };

  DKResizer.prototype.init = function() {
    windowWith = window.innerWidth;
    windowHeight = window.innerHeight;
    window.addEventListener('resize', this.resize.bind(this), false);
  };

  DKResizer.prototype.resize = function(event) {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    if ( timeoutId ) {
      clearTimeout( timeoutId );
    }
    timeoutId = setTimeout( this.update, _tickDelay );
  };

  DKResizer.prototype.update = function() {
    console.log('udpate',this.onUpdate);
    if (self.onUpdate) self.onUpdate.dispatch(windowWidth,windowHeight);
  };

  module.exports = DKResizer;

});