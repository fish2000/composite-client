define(function (require, exports, module) {

  /**
   * Assigns the module as a Device object.
   * @suppress {checkTypes}
   */
  exports = module.exports = Device;

  function Device(context) {
    this.positionHandler_  = this.onPositionChanged.bind(this);
    this.location = null;
    this.width = 0;
    this.height = 0;
    this.initialize();
  };

  Device.prototype.initialize = function() {
    navigator.geolocation.getCurrentPosition(this.positionHandler_);
    navigator.geolocation.watchPosition(this.positionHandler_);

    window.addEventListener('resize', this.onResize.bind(this), false);
    this.onResize(null);

  };

  Device.prototype.onPositionChanged = function(location) {
    this.location = location;
  };

  Device.prototype.onResize = function(event) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  };



});