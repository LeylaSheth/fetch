window.onload = function() {
    var oBtn = this.document.getElementById('btn');
    var oDiv = this.document.getElementById('div1');
    oBtn.onclick = function() {
        //从服务器获取数据
        //1.创建一个XMLHttpRequest()
        const xhr = new XMLHttpRequest();
        //2.建立 连接
        xhr.open('GET', 'data.txt', true);
        //3.发送请求
        xhr.send();
        //4.返回数据
        xhr.onload = function() {
            if (this.status === 200) {
                oDiv.innerHTML = this.responseText;
            }
        }
    }
}