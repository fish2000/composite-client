define(function (require, exports, module) {

  function toPoint(event) {
    var point = {
      x: event.clientX || event.changedTouches[0].pageX, 
      y: event.clientY || event.changedTouches[0].pageY
    };
    return point;
  };



  function distanceBetweenPoints(p1, p2) {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    return Math.sqrt((dx * dx) + (dy * dx));
  }

  var Touch = function(target) {
    this.target = target;
    this.onEnter = null;
    this.onExit = null;
    this.startPoint = null;
    this.target.addEventListener('touchstart', this.touchStart.bind(this), false);
    this.target.addEventListener('touchmove', this.touchMove.bind(this), false);
    this.target.addEventListener('touchend', this.touchEnd.bind(this), false);
  };

  Touch.YDELTA_THRESHOLD = 20;

  Touch.prototype.touchStart = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var point = toPoint(event);

    this.startPoint = point;
    console.log('touchStart', point);
    if (this.onEnter) {
      this.onEnter(point, point);
    }
  };

  Touch.prototype.touchMove = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var point = toPoint(event);
    //console.log('touchMove', point);
  };

  Touch.prototype.touchEnd = function(event) {
    event.preventDefault();
    event.stopPropagation();
    var point = toPoint(event);
    console.log('touchEnd', point);

    var dy = point.y - this.startPoint.y;
    var aby = Math.abs(dy);
     
    if (aby < Touch.YDELTA_THRESHOLD) {
      var dx = point.x - this.startPoint.x;
      if (this.onExit) {
        var dist = distanceBetweenPoints(this.startPoint, point);
        var mag = {x: dx, y: dy};

        this.onExit(point, mag);
      }
    }
    
  };










    



    
    exports = module.exports = Touch;
});