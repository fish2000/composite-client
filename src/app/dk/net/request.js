define(function (require, exports, module) {

    var Request = function(url) {
        //EventListener.call(this);
        this.name = "DKRequest";
        this.method = 'GET';
        this.request = new XMLHttpRequest();
        this.url = url;
        this.responseType = 'json';
        this.responseData = null;
        this.onComplete = null;
    };

    //DKRequest.prototype = Object.create(EventListener.prototype);

    Request.prototype.send = function() {
        if (!this.url) {
            throw new Error("DKRequest requires a url property to be not null.");
        }
        this.request.open(this.method, this.url, true);
        this.request.send();
        this.request.onload = this.onRequestLoaded.bind(this);
        this.request.onreadystatechange = this.onStateChange.bind(this);
    };

    Request.prototype.onRequestLoaded = function(progressEvent) {

    };

    Request.prototype.onStateChange = function() {
        if (this.request.readyState==4) {
            if (this.responseType=='json') {
                this.responseData = JSON.parse(this.request.responseText);
            }
            if (this.onComplete) this.onComplete(this.responseData);
        }
    };

    module.exports = Request;
});
