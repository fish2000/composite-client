define(function (require, exports, module) {


  exports = module.exports = ComSock;

  var di = 0;

  function ComSock() {
    
  };

  ComSock.prototype.connect = function(url) {
    if (!url) {
      throw new Error('Please provide a endpoint url to the sockjs server.');
    }

    this.session = null;
    this.sessionData = null;
    this.uuid = null;
    this.deviceIndex = null;
    this.sockjs_ = new SockJS(url);
    this.multiplexer_ = new WebSocketMultiplex(this.sockjs_);
    this.channel_ = this.multiplexer_.channel('composite');

    this.channel_.onmessage = this.messageHandler_.bind(this);
    this.onMessage = null;

  };

  ComSock.prototype.messageHandler_ = function(message) {

    message = JSON.parse(message.data);
    console.log('messageHandler_ : ', message);
    console.log(message);
    switch(message.type) {
      case "uuid":
        this.uuid = message.data.uuid;
        console.log('uuid', this.uuid);
        console.log(this.uuid);
        break;
      case "join":
        this.createSession(message.data.channel);
        break;
      case "session":
        this.sessionUpdate(message.data);
      case "payload":
        if (this.onMessage) {
          this.onMessage(message.data);
        }
      default:
        //console.log('connect message:', message);
        break;
    }
  };



  
  ComSock.prototype.sendMessage = function(message) {
    console.log('send message: ', message);
    this.channel_.send(JSON.stringify(message));
  };

  ComSock.prototype.createSession = function(session_id) {
    console.log('createSession', session_id);
    this.session = this.multiplexer_.channel(session_id);
    this.session.onmessage = this.messageHandler_.bind(this);
  };

  ComSock.prototype.checkDevice =function(link, index) {
    var i=0;
    if (index==0) {
      i = di++;
      if ( link.deviceA.uuid === this.uuid ) {
        return i;
      } else if (link.deviceB.uuid === this.uuid ) {
        di++;
        return i+1;
      } else {
        di ++;
      }
    } else {
      i = di++;
      if ( link.deviceB.uuid === this.uuid )  {
        return i;
      }
    }
    return 0;
  };

  ComSock.prototype.sessionUpdate = function(data) {
    _viewport = document.querySelector('.viewport');
    if (this.sessionData === null) {
      this.sessionData = data;
      
      var links = data.links;
      var len = links.length;
      var link;

      di=0;
      for (var i=0; i<len; i++) {
        link = links[i];
        var mdi = this.checkDevice(link, i);
        this.deviceIndex = mdi;
      }
      console.log('device index: ', this.deviceIndex);
      _viewport.innerHTML = 'Device Index: '+ this.deviceIndex;
    }
    this.sessionData = data;
    if (this.sessionCallback) this.sessionCallback(data);
  };


});
