define(function (require, exports, module) {

  var signals = require('signals');

  var _value = 0;
  var _minValue = 0;
  var _maxValue = 0;
  var _offset = 0;


  var DKScrollBar = function() {
    this.onUpdate = new signals.Signal();
    this.el = document.createElement('div');
    this.el.className = 'dk-vscrollbar';

    this.track = document.createElement('div');
    this.track.className = 'track';

    this.handle = document.createElement('div');
    this.handle.className = 'handle';

    this.bindHandleDown = this.onHandleDown.bind(this);
    this.bindHandleUp = this.onHandleUp.bind(this);
    this.bindMouseMove = this.onMouseMove.bind(this);
    this.el.appendChild(this.track);
    this.el.appendChild(this.handle);


  };

  DKScrollBar.prototype.init = function() {
    _maxValue = this.track.offsetHeight - this.handle.offsetHeight;
    console.log('init', _maxValue);
    this.handle.addEventListener('mousedown', this.bindHandleDown);
    this.handle.addEventListener('mouseup', this.bindHandleUp);
  };

  DKScrollBar.prototype.destroy = function () {
    this.handle.removeEventListener('mousedown', this.bindHandleDown);
    this.handle.removeEventListener('mouseup', this.bindHandleUp);
  };

  DKScrollBar.prototype.onHandleDown = function(event) {

    _offset = event.clientY - event.layerY;
    window.addEventListener('mouseup', this.bindHandleUp);
    window.addEventListener('mousemove', this.bindMouseMove);
  };

  DKScrollBar.prototype.setPosition = function(value) {
    console.log('value:', _maxValue );
    this.handle.style.top = value*_maxValue + 'px';
  };

  DKScrollBar.prototype.onHandleUp = function(event) {
    window.removeEventListener('mousemove', this.bindMouseMove);
    window.removeEventListener('mouseup', this.bindHandleUp);
  };

  DKScrollBar.prototype.onMouseMove = function(event) {
    _maxValue = this.track.offsetHeight - this.handle.offsetHeight;
    var handlePosition = (event.clientY  - _offset);
    if (handlePosition<=0) handlePosition = 0;
    if (handlePosition>=_maxValue) handlePosition = _maxValue;
    this.handle.style.top = handlePosition + 'px';
    _value = handlePosition/_maxValue;
    console.log(this.handle.offsetTop);
    this.onUpdate.dispatch(_value);
  };

  module.exports = DKScrollBar;

});