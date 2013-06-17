(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
define(function (require, exports, module) {

    var signals = require('signals');

    var _wheelSpeed = 0.1;
    var _value = 0;
    var _target = null;
    var _child = null;
    var _scrollHeight = 0;
    var _contentSize = 0;
    var _ticking = false;
    var _minLimit = 0;
    var _maxLimit = 0;
    var _deltaValue = 0;
    //var _offset = 0;


    var DKScroller = function(target) {
        this.onUpdate = new signals.Signal();
        _target = target;
        _child = _target.firstChild;

        _contentSize = _child.offsetHeight;
        _minLimit = _target.offsetHeight - _contentSize;

        this.value = 0;
        this.easingValue = 0;
        this.speed= 0;
        this.prevPosition = 0;

        _target.onmousewheel = this.onMouseWheel.bind(this);
    };

    DKScroller.prototype.updateHeight = function(height) {
      _contentSize = height;
    };

    DKScroller.prototype.setWheelSpeed = function(value) {
      _wheelSpeed = value;
    };

    DKScroller.prototype.onMouseWheel = function(event) {
      event.preventDefault();
      //console.log(event);
      this.speed = event.wheelDeltaY * _wheelSpeed;
      if(Math.abs(this.speed) < 1) this.speed = 0;

      this.requestTick();
    };

    DKScroller.prototype.requestTick = function() {
        //console.log(this.update);
        if (!_ticking) {
            requestAnimationFrame(this.update.bind(this));
            _ticking = true;
        }
    };

    DKScroller.prototype.update = function() {
      _minLimit = _target.offsetHeight - _contentSize;
      _value = this.easingValue;

      this.speed *= 0.9;
      this.easingValue += this.speed;
      if (this.easingValue <= _minLimit) this.easingValue = _minLimit;
      if (this.easingValue >= _maxLimit) this.easingValue = _maxLimit;
      if(Math.abs(this.speed) < 1) this.speed = 0;
      _ticking=false;
      if (this.onUpdate) this.onUpdate.dispatch(_value);
    };

    module.exports =  DKScroller;
});