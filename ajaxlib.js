//���캯��
function SimpleHttp(url, callback) {
    //��������
    this.http = new XMLHttpRequest();
}

SimpleHttp.prototype.get = function(url, callback) {
    //��������
    this.http.open('GET', url, true);
    //���ݴ���
    this.http.onload = function() {
        if (this.status === 200) {
            callback(null, this.responseText); //null��index�е�err��û��error��ӡdata
        } else {
            callback('error');
        }
    }
    this.http.send();
};

//POST
SimpleHttp.prototype.post = function(url, data, callback) {
    //��������
    this.http.open('POST', url, true);
    //���ݴ���
    this.http.onload = function() {
        callback(null, this.responseText); //null��index�е�err��û��error��ӡdata
    }
    this.http.setRequestHeader('Content-Type', 'application/json');
    //��������POST -> BODY 
    this.http.send(JSON.stringify(data));
};

//PUT
SimpleHttp.prototype.put = function(url, data, callback) {
    //��������
    this.http.open('PUT ', url, true);
    //���ݴ���
    this.http.onload = function() {
        callback(null, this.responseText); //null��index�е�err��û��error��ӡdata
    }
    this.http.setRequestHeader('Content-Type', 'application/json');
    //��������POST -> BODY 
    this.http.send(JSON.stringify(data));
};
//DELETE
SimpleHttp.prototype.delete = function(url, callback) {
    //��������
    this.http.open('DELETE', url, true);
    //���ݴ���
    this.http.onload = function() {
        if (this.status === 200) {
            callback(null, this.responseText); //null��index�е�err��û��error��ӡdata
        } else {
            callback('error');
        }
    }
    this.http.send();
};