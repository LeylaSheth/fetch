# 数据交互基础

## 为什么需要异步编程

数据交互可以同步，早期互联网，这样会浪费响应时间

比如在输入表单不合格时候，直接反馈，执行一个任务时候不影响另一个任务的执行

无需重新加载整个网页，能够更新部分网页

通过在后台与服务器进行少量数据交换，ajax可以使网页实现异步更新

```js
var a = 12;
var endTime = Date.now() + 3000;
while(Date.now()<endTime){
    //
}
alert(a);
//加载页面，时隔3s打印，这是一个同步请求，while执行结束才开始
//
setInterval(function(){
    
},3000);
alert(a);
//加载页面直接打印，这是一个异步请求，并行
```



## Ajax简介

异步的JavaScript和XML

技术组合

接受发送数据

局部刷新

XML->JSON

### 使用

1. 用XHR（XMLhttpRequset）
   * 一个浏览器提供的对象
   * 提供方法数据交互 get，post
   * 可以使用各种协议、http
   * 处理各种数据，主要JSON，or XML
2. Fetch Api   ES6
3. jquery($.ajax)
4. Axios(vue-resource) -> var
5. Node HTTP
6. Superagent



以前，数据库与网页之间的数据传输，网页向数据库请求数据，然后等待响应

现在是两者之间有一个xhr对象，网页向对象请求数据，xhr向后台数据库请求数据

## Ajax数据交互过程

1. 创建一个XMLHttpRequest()

2. 建立连接open

   * 参数
     1. GET/POST
     2. URL
     3. 是否异步

3. 发送请求send()

4. 返回数据

   数据已经返回，浏览器下载数据成功

   ```js
   xhr.onload = function(){
       if(this.status === 200){
           this.responseText
       }
   }
   ```

   1. utf-8
   2. 注意有缓存

## Ajax与json数据解析

服务器返回的数据都是字符串，而不是json

* string->json

  `JSON.parse`

要使用标准json

* bejson检测

```js
window.onload = function() {
    var oBtn = this.document.getElementById('btn');
    var oDiv = this.document.getElementById('div1');
    oBtn.onclick = function() {
        //从服务器获取数据
        //1.创建一个XMLHttpRequest()
        const xhr = new XMLHttpRequest();
        //2.建立 连接
        xhr.open('GET', 'json.txt', true);
        //3.发送请求
        xhr.send();
        //4.返回数据
        xhr.onload = function() {
            if (this.status === 200) {
                oDiv.innerHTML = JSON.parse(this.responseText).name;
            }
        }
    }
}
```



## Ajax与接口数据获取

1. 什么是接口

   后台给前端提供数据和服务的地址，url

   注意：1.地址 2.格式 3.返回数据的正确性

   es6模板引擎（字符串拼接）

   JSON.parse

   原生JS DOM操作

# 数据交互进阶

## RESTFUL API

api地址，url

Representational State Transfer：表现层状态转移

URL定位资源，用HTTP动词（GET，POST，DELETE，DETC）描述操作

| 操作    | 作用         |
| ------- | ------------ |
| GET     | 获取资源     |
| POST    | 新建资源     |
| PUT     | 更新整个资源 |
| DELETE  | 删除资源     |
| PATCH   | 更新部分资源 |
| HEAD    | 请求头信息   |
| OPTIONS | 请求方法     |

<a href="http://jsonplaceholder.typicode.com/">example</a>

## 回调函数

1. 回调函数，不立即执行，某个操作执行后，才执行

   

## 自定义Ajax库封装

## ES6 promise

数据交互

ajax后跟一个promise，异步操作时候使用

链式操作很方便进行回调函数



## Fetch API

1. 传统ajax

   ```js
   var xhr = new XMLHttpRequest();
   xhr.open('GET',url, true);
   xhr.responseType='json';
   xhr.onload = function() {
       console.log(xhr.response);
   };
   xhr.onerror = function() {
       console.log("Oops,error");
   };
   xhr.send();
   ```

   <hr/>

2. fetch()

   ```js
   fetch(url).then(function(response) {
       return response.json();
   }).then(function(data) {
       console.log(data);
   }).catch(function(e) {
       console.log('die');
   })
   ```

   <a href="http://jsonplaceholder.typicode.com/posts">api</a>

## 箭头函数

```js
window.onload = function() {
            var oBtn = document.getElementById('btn');
            var oDiv = document.getElementById('div1');
            oBtn.onclick = function() {
                fetch('data.txt')
                    .then(res => res.text())
                    .then(data => oDiv.innerHTML = data)
                    .catch(err=>err)
            }
        }
```



## 自定义Fetch API库封装

# 高级

## Async & Await

## 自定义Fetch API(Async&Await)库封装