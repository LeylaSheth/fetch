window.onload = function() {
    var oBtn = this.document.getElementById('btn');
    var oUl = this.document.getElementById('oUl');
    oBtn.onclick = function() {
        //从服务器获取数据
        //1.创建一个XMLHttpRequest()
        const xhr = new XMLHttpRequest();
        //2.建立 连接
        xhr.open('GET', 'array.txt', true);
        //3.发送请求
        xhr.send();
        //4.返回数据
        xhr.onload = function() {
            if (this.status === 200) {
                //oDiv.innerHTML = JSON.parse(this.responseText);
                //console.log(JSON.parse(this.responseText))
                let arr = JSON.parse(this.responseText);
                let str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += '<li>' + arr[i].name + '</li>'
                }
                oUl.innerHTML = str;
            }
        }
    }
}