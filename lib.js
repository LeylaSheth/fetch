window.onload = function() {
    var oBtn = this.document.getElementById('btn');
    var oDiv = this.document.getElementById('div1');
    oBtn.onclick = function() {
        //�ӷ�������ȡ����
        //1.����һ��XMLHttpRequest()
        const xhr = new XMLHttpRequest();
        //2.���� ����
        xhr.open('GET', 'data.txt', true);
        //3.��������
        xhr.send();
        //4.��������
        xhr.onload = function() {
            if (this.status === 200) {
                oDiv.innerHTML = this.responseText;
            }
        }
    }
}