window.onload = function() {
    var oBtn = this.document.getElementById('btn');
    var oUl = this.document.getElementById('oUl');
    oBtn.onclick = function() {
        //�ӷ�������ȡ����
        //1.����һ��XMLHttpRequest()
        const xhr = new XMLHttpRequest();
        //2.���� ����
        xhr.open('GET', 'array.txt', true);
        //3.��������
        xhr.send();
        //4.��������
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