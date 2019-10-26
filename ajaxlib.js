//构造函数
function SimpleHttp(url, callback) {
    //创建对象
    this.http = new XMLHttpRequest();
}

SimpleHttp.prototype.get = function(url, callback) {
    //建立连接
    this.http.open('GET', url, true);
    //数据处理
    this.http.onload = function() {
        if (this.status === 200) {
            callback(null, this.responseText); //null从index中的err，没有error打印data
        } else {
            callback('error');
        }
    }
    this.http.send();
};

//POST
SimpleHttp.prototype.post = function(url, data, callback) {
    //建立连接
    this.http.open('POST', url, true);
    //数据处理
    this.http.onload = function() {
        callback(null, this.responseText); //null从index中的err，没有error打印data
    }
    this.http.setRequestHeader('Content-Type', 'application/json');
    //发送请求POST -> BODY 
    this.http.send(JSON.stringify(data));
};

//PUT
SimpleHttp.prototype.put = function(url, data, callback) {
    //建立连接
    this.http.open('PUT ', url, true);
    //数据处理
    this.http.onload = function() {
        callback(null, this.responseText); //null从index中的err，没有error打印data
    }
    this.http.setRequestHeader('Content-Type', 'application/json');
    //发送请求POST -> BODY 
    this.http.send(JSON.stringify(data));
};
//DELETE
SimpleHttp.prototype.delete = function(url, callback) {
    //建立连接
    this.http.open('DELETE', url, true);
    //数据处理
    this.http.onload = function() {
        if (this.status === 200) {
            callback(null, this.responseText); //null从index中的err，没有error打印data
        } else {
            callback('error');
        }
    }
    this.http.send();
};