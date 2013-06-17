define(function (require, exports, module) {

  var ComSock = require('service/comsock');
  var Touch = require('service/touch');
  var Device = require('service/device');

  var _instance = null;
  var _viewport;

  var comSock;
  var _touch;
  var _device;

  var Application = function() {
    if (_instance !== null) {
      throw new Error('Can instantiate through constrsuctor. Use Application.shared()');
    }
    _viewport = document.querySelector('.viewport');
  };

  Object.defineProperties(Application.prototype, {
      viewport : {
        get: function() {
          return _viewport;
        }
      }
  });

  Application.shared = function() {
    if (_instance === null) {
      _instance = new Application();
    }
    return _instance;
  };

  Application.prototype.initialize = function() {
    console.log('Application.init');


    comSock = new ComSock();
    comSock.connect('/composite');

    _device = new Device(_viewport);

    _touch = new Touch(window);
    _touch.onEnter = this.onTouchEnter.bind(this);
    _touch.onExit = this.onTouchExit.bind(this);
  };

  Application.prototype.onTouchEnter = function(point, magnitude) {
    this.sendTouchEvent('enter', point, magnitude);
  };

  Application.prototype.onTouchExit = function(point, magnitude) {
    this.sendTouchEvent('exit', point, magnitude);
  };

  Application.prototype.sendTouchEvent = function(type, point, magnitude) {
    var devObj = {
      uuid : comSock.uuid,
      width : _device.width,
      height : _device.height
    };
    comSock.sendMessage({
                          type: type,
                          data: { 
                            device:devObj,
                            geo:_device.location,
                            entry:[point.x, point.y],
                            vector:[magnitude.x, magnitude.y]
                          }
                        });
  }

  return Application;
});