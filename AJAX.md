# AJAX与Comet

## 异步

### 同步和异步任务

同步任务没有被引擎挂起，在主线程上排队的任务。一个任务执行完执行下一个。

异步任务不进入主线程而进入任务列表的任务。由引擎认为某个任务可以执行如AJAX，该任务（采用回调函数的形式）进入主线程执行，排在异步任务后的代码不用等待异步任务结束后，就会马上运行

## 异步操作的模式

### 回调函数

```js
function f1() {
    //...
}
function f2() {
    //...
}
//如果f1是异步操作，f2会立即执行，不会等到f1结束后再执行

function f3(callback) {
    //...
    callback();
}
function f4() {
    //...
}
f3(f4);
//这里把f2写成了f1的回调函数
```

回调函数的很简单，但是各个部分之间高度耦合，程序结构混乱难以追踪，每个任务只能指定一个回调函数

### 事件监听

```js
f1.on('done', f2);//为f1绑定一个事件，当f1发生done事件执行f2
function f1() {
    setTimeout(function(){
        //...
        f1.trigger('done');//执行完成后立即触发done事件，从而执行f2
    },1000)
}
```



### 发布/订阅

```js
jQuery.subscribe('done', f2);//f2向信号中心jQuery订阅done信号
function f1() {
    setTimeout(function() {
        //...
        jQuery.publish('done');
        //f1执行完成后向信号中心jQuery发布done信号，从而引起f2执行
    },1000);
}
jQuery.unsubscribe('done', f2);//f2完成执行后，可以取消订阅
```

### 异步操作流程控制串行并行



## 定时器

### setTimeout()

`setTimeout`函数用于执行某个函数或代码段，在多少ms后执行

该函数返回一个整数，表示定时器的编号，以后可以用于取消这个定时器

```js
var timerId = setTimeout(func|code, delay);//第一个参数是要推迟执行的函数名或者代码，第二个参数是推迟执行的毫秒数
```

setTimeout()可以接收多个参数用于传入推迟执行的函数（回调函数）

```
setTimeout(function (a,b) {
	console.log(a + b);
},1000,2,1);
```

如果回调函数是对象的方法，setTimeout使得方法内部的this关键字指向全局环境而不是定义的对象

```js
var x = 1;

var obj = {
    x: 2,
    y: function() {
        console.log(this.x);
    }
};

setTimeout(obj.y, 1000)//1

//更正方法
setTimeout(function () {
    obj.y();
}, 1000);//将对象的方法放在匿名函数中，使得方法在对象的作用域中执行

setTimeout(obj.y.bind(obj), 1000)//使用bind绑定
```



### setInterval()

用法与setTimeout一致，**`setInterval`指定某个任务每隔一段时间执行一次，无限次的定时执行**

实现动画

```js
var div = document.getElementById('someDiv');
var opacity = 1;
var fader = setInterval(function() {
    opacity -= 0.1;
    if (opacity >= 0) {
        div.style.opacity = opacity;
    } else{
        clearInterval(fader);
    }
},100)
```



### clearTimeout(), clearInterval()

`setTimeout`和`setInterval`函数，都返回一个整数值，表示计数器编号，把该整数传入`clearTimeout`和`clearInterval`函数，用于取消定时器

```js
var id1 = setTimeout(f, 1000);
var id2 = setInterval(f, 1000);

clearTimeout(id1);
clearInterval(id2);
```



可写一个函数，取消当前所有的`setTimeout`定时器

```js
(function() {
    //每轮事件循环检查一次
    var gid = setInterval(clearAllTimeouts, 0);
    
    function clearAllTimeouts() {
        var id = setTimeout(function() {}, 0);
        while (id > 0) {
            if (id !== gid) {
                clearTimeout(id);
            }
            id--;
        }
    }
})();//首先调用了setTimeout，得到一个计时器编号，把编号比他小的计数器全部取消
```



## XMLHttpRequest对象

1. 在后台向客户端发送数据
2. 从服务器接收数据
3. 更新网页而不重新加载



### 创建XMLHttpRequest对象

```js
var variable=new XMLHttpRequest();
var xmlhttp=createXHR();
```

判断是否支持而创建对象

```js
var xmlhttp;
if(window.XMLHttpRequest){
    xmlhttp=new XMLHttpRequest();
} else{
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP")
}
```

### XHR用法

第一个方法是open()，它并不会真的发送请求，只是启动一个请求准备发送

`send()`发送特定请求，它接收一个参数，即要作为请求主体发送的数据

如果不需要请求主体发送数据，就必须传入null

```js
var xhr=createXHR();
xhr.open("GET","example.txt",true);
xhr.send(null);
```



| 属性         | 功能                                                         |
| ------------ | ------------------------------------------------------------ |
| responseText | 作为响应主体被返回的文本                                     |
| responseXML  | 响应内容类型为XML，这个属性中将保存包含着响应数据的XML DOM文档 |
| status       | 响应的HTTP状态                                               |
| statusText   | HTTP状态说明                                                 |

```js
var xhr = createXHR();
xhr.open("get", "example.txt", true);
xhr.send(null);

if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText);
} else {
    alert("Request was failed: " + xhr.status);
}
```



## XHR请求（AJAX-向服务器发送请求）

XMLHttpRequest对象用于和服务器交换数据



### 向服务器发送请求

```js
var xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","test1.txt",true);
xmlhttp.send();
//opem(method,url,async);规定请求的类型、URL、是否异步处理，true为异步
//send(string)将请求发送到服务器，string仅用于POST
```



### 为避免缓存结果，向URL添加唯一id

```js
var xmlhttp=new XMLHttpRequest();
xmlhttp.open("GET","demo_get.asp?t="+Math.random(),true);
xmlhttp.send();
```



### setRequestHeader(header,value)

如果想要像HTML表单一样POST数据，使用这个来添加HTTP头

```js
var xmlhttp=new XMLHttpRequest();
xmlhttp.open("POST","ajax_test.asp",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//header：规定头的名称；value：规定头的值
xmlhttp.send("fname=Bill&lname=Gates");//string用于POST
```



## XHR响应（AJAX-服务器响应）

获得来自服务器的响应，使用**XMLHttpRequest**对象的 **responseText** 或者 **responseXML**属性

- responseText：获得 *字符串* 形式的响应数据
- responseXML：获得*XML*形式的响应数据

**test01.html**

```html
<head>
    <script>
        function loadXMLDoc(){
            var xmlhttp;
            var txt,x,i;
            
            if(window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
            } else{
                xmlhttp = new ActiveXObject("Microsoft.XNLHTTP");
            }
            
            xmlhttp.onreadystatechange = function(){
                if(xmlhttp.readyState == 4 && xmlhttp.ready.status == 200){
                    xmlDoc = xmlhttp.responseXML;
                    txt = "";
                    x = xmlDoc.getElementByTagName("title");
                    for (let i=0; i < x.length; i++){
                        txt = txt + x[i],childNodes[0].nodeValue + "<br/>";
                    }
                    document.getElementById("myDiv").innerHTML = txt;
                }
            }
            
        }
        xmlhttp.open("GET","books.xml",true);
        xmlhttp.send();
	</script>
</head>

<body>
    <h2>Mybook</h2>
    <div id="myDiv"></div>
    <button type="button" onclick="loadXMLDoc()">
        Get List
    </button>
</body>
```



### XML readState（AJAX-onreadystatechange事件）

| 属性               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| onreadystatechange | 存储函数或者函数名，每当readyState属性改变，就会调用该函数   |
| readyState         | 存有XMLHttpRequest的状态，从0到4的变化<br/>0：请求未初始化，尚未调用open()方法<br/>1：服务器连接已建立，已经调用open，尚未调用send<br/>2：请求已接收，已经调用send，尚未接收到响应<br/>3：请求处理中，已经接收到部分响应数据<br/>4：请求已完成且响应已就绪，已经接收到全部响应数据，并且可以在客户端使用 |
| status             | 状态码<br/>200："OK"<br/>304：请求的资源没有被修改，可以直接用浏览器中缓存的版本<br/>404：未找到页面 |
| statusText         | HTTP状态的说明                                               |



只要readyState属性的值由一个变成另一个，就会触发一次readystatechange事件。需要在调用`open()`前指定，以确保兼容性

```js
var xhr = createXHR();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
            alert(xhr,responseText);
        } else {
            alert("Requset was failed: " + xhr.status);
        }
    }
};
xhr.open("get", "example.txt", true);
xhr.send(null);
```



```js
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState==4 && xmlhttp.status==200){
        //这里使用xmlhttp而不是this，否则会失败
        docunment.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
}
```

检查状态

```js
var xhr=createXHR();
xhr.open("GET","example.txt",true);
xhr.send(null);

if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
    alert(xhr.responseText);
} else{
    alert("Request was unsuccessful:" + xhr.status);
}
```



## HTTP头部信息

建立连接之类，cookie等信息

```js
var xhr = createXHR();
//...
xhr.open("get", "exampkle.php", true);
xhrsetRequestHeader("MyHeader", "MyValue");//自定义头部信息
xhr.send(null);
```

```js
var myHeader = xhr.getResponseHeader("MyHeader"); //获取传入头部字段名称的相应的响应头部信息
var allHeaders = xhr.getAllResponseHeaders(); //获取所有的头部信息
```

### POST or GET

GET更简单更快

使用POST情况

1. 无法使用缓存文件（更新服务器上的文件或数据库，就可能要做出一点改动）
2. 向服务器发送大量数据（POST没有数据量限制）
3. 发送包含未知字符的用户输入（POST更加稳定可靠）

### GET请求

向服务器查询某些信息，将查询字符串参数追加到URL的末尾，以便把信息发送给服务器

#### 使用encodeURIComponent()进行编码

编码后放到URL的末尾

```js
function addURLParam(url, name, value) {
    url += (url.indexOf("?") == -1 ? "?" : "&"); //索引，不存在？返回-1，然后添加？
    url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
    return url;
}

var url = "example.php";
//添加参数
url = addURLParam(url, "name", "Lee");
//初始化请求
xhr.open("get", url, true);
```



将参数名称和值进行编码，添加到参数的URL



### POST请求

用于向服务器发送应该被保存的数据，把数据作为请求的主体提交，可以包含更多的数据，格式不限

可以使用XHR模仿表单提交

```js
function submitDate() {
    var xhr = createXHR();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.statue == 304) {
                alert(xhr.responseText);
            } else {
                alert("Request was failed: " + xhr.status);
            }
        }
    };
    xhr.open("post", "postexample.php", "true");
    //设置头部信息，表单提交的内容类型
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var form = document.getElementById("user-info");
    xhr.send(serialize(form));//创建字符串
}
```



## FormData

为序列化表单以及创建与表单格式相同的数据提供便利

```js
var data = new FormData();//创建对象
data.append("name", "Lee");//接收参数：key和value，可以添加很多键值对

//也可传入表单元素，用表单元素的数据预先向其中填入键值对
var dataform = new FormData(document.forms[0]);
```



```js
var xhr = createXHR();
xhr.open("post", "postexample.php", true);
var form = docunment.getElementById("user-info");
xhr.send(new FormData(form));
```

不同设置请求头部，XHR对象能够识别传入的数据类型为FormData的实例

## 超时设定

XHR对象的timeout属性，设置请求超时时间，超时没有收到响应就会触发timeout时间，进而调用ontimeout事件处理程序

```js
var xhr = createXHR();
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        try{
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        	    alert(xhr,responseText);
        	} else {
            	alert("Requset was failed: " + xhr.status);
        	}
        } catch (ex) {
            //由ontimeout事件处理程序处理
        }
    }
};
xhr.open("get", "timeout.php", true);
xhr.timeout = 1000;//请求超过1s就会终止
//终止时调用ontimeout
xhr.ontimeout = function() {
    alert("Request did not return in 1s.");
};
xhr.send(null);
```



## Comet

Ajax是一种从页面向服务器请求数据的技术

Comet是一种服务器向页面推送数据的技术

**长轮循和流*

* 长轮询：浏览器定时向服务器发送请求，查看是否有更新的数据

  ​				短轮循的时间线				

  ![1571720572373](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1571720572373.png)



​						长轮询时间线：发送一个到服务器的请求，但是服务器始终保持打开直到发送数据返回。由浏览器关闭连接，随即由发起一个到服务器的新的请求

![1571720660223](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1571720660223.png)



**HTTP流**

在页面的整个生命周期内只使用一个HTTP连接。即，浏览器向服务器发送一个请求，而服务器保持连接打开，然后周期性的向浏览器发送数据

# Promise对象

## Promise含义

异步编程解决方案
回调函数和事件

Promise是一个容器，里面保存着某个未来才会结束的事件（通常是异步操作）的结果
Promise是一个对象，从中可以获取异步操作的信息，它提供统一的API，各种异步操作都可以用同样的方法来处理

### Promise对象的特点

1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：
   1. pending（进行中）
   2. fulfilled（已成功）
   3. rejected（已失败）
      异步操作的结果，可以决定当前状态
2. 一旦状态改变，就不会再变，任何时候都可以获得这个结果
   1. pending->fulfilled
   2. pending->rejected
      这两种情况发生，状态凝固，不再改变，称为定型resolved。如果改变发生，再对promise对象添加回调函数，也会立即得到这个结果。与event事件不同，如果错过了再去监听会得不到结果

### 基本用法

Promise对象是一个构造函数，用于生成实例

```js
const promise = new Promise(function(resolve, reject){
    //...some code
    if (/*异步操作成功*/){
        resolve(value);//函数
    } else{
        reject(error);
    }
});
```

Promise构造函数接收一个函数作为参数，两个参数分别是`resolve`和`reject`。他们也是两个函数。

* `resolve`：将Promise对象的状态从pending变成resolved。异步成功时调用，并将异步操作的结果，作为参数传递出去
* `reject`：将Promise对象的状态从pending变成rejected，异步失败时嗲用，将报错结果作为参数传递出去

Promise实例生成后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数

```js
promise.then(function(value) {
    //success
}, function(error) {
    //failure
});
```

`then`方法可以接受两个回调函数作为参数

1. 状态变为resolved调用第一个
2. 变为rejected调用第二个，是可选的
   都接受Promise对象传入的值作为参数

```js
function timeout(ms) {//返回一个promise实例，表示过一段时间才会发生结果
    return new Promise((resolve,reject) => {
        setTimeout(resolve,ms,'done');//只鹅后promise实例的状态变为resolved，就会触发then方法绑定的回调函数
    });
}

timeout(100).then(value => {
    console.log(value);
});
```

Promise新建后就会立即执行

```js
let promise = new Promise(function(resolve,reject) {
    console.log('Promise');
    resolve();
});

promise.then(function() {
    console.log('resolved');
});

console.log('Hi!');
//Promise
//Hi!
//resolved
```

Promise新建后立即执行
then方法指定的回调函数，在当前脚本所有同步任务执行完才会执行

#### Promise对象实现Ajax操作

```js
const getJSON = function(url) {
    const promise = new Promise(function(resolve, reject){ //getJSON对XMLHttpRequest对象的封装
        const handler = function() {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                resolve(this.response);
            } else{
                reject(new Error(this.statusText));
            }
        };
        const client = new XMLHttpRequest();
        client.open("GET", url);
        client.onreadystatechange = handler;
        client.responseType = "json"; //发送针对JSON数据的HTTP请求
        client.setRequestHeader("Accept", "application/json");
        client.send();
    });
    
    return promise; //返回一个promise对象
};

getJSON("/posts.json").then(function(json) {
    console.log('Contents: '+ json);
}, function(error) {
    console.error('出错'， error)
});
```



## Promise.prototype.then()

then方法是定义在原型对象上的方法

为Promise实例添加状态改变时的回调函数。

第一个参数是`resolved`状态下的回调函数，第二个参数是`rejected`状态的回调函数



`then`方法返回一个Promise实例，就可以采用链式写法

```js
getJSON("/posts.json").then(function(json) {
    return json.post;
}).then(function(post){
    //...
});
```



## Promise.prototype.catch()

表示`.then(null, rejection)`或`.then(undefined, rejection)`

用于指定发生错误时的回调函数

```js
getJSON('/posts.json').then(function(posts) {
    //...
}).catch(function(error){
    //处理getJSON和前一个回调函数运行时候发生的错误
    console.log("发生错误！"，error);
});
```



## Promise.prototype.finally()

`finally`方法表示不管Promise最后的状态如何，都会执行的操作

```js
promise
.then(result => {...})
.catch(error => {...})
.finally(() => {...});
```

 

# Generator函数

Generator函数是一个状态机，封装了多个内部状态

1. `function`关键字和函数名中间有一个*
2. 函数体内部使用yield表达式，定义不同的内部状态

```js
function* helloWorldGenerator() {
    yield 'hello'; 
    yield 'world';
    return 'ending';
} 
//定义了一个Generator函数，有三个状态`hello`,`world`和return（结束执行）
var hw = helloWorldGenerator();
```

调用方法是在函数名后加一对圆括号

调用Generator函数后，该函数并不执行

返回的也不是函数运行结果

而是一个指向内部状态的指针对象，也就是遍历器对象

然后调用遍历器对象的`next`方法，使得指针指向下一个状态

每次调用`next`方法，使得指针从函数头部或者上次停下的地方开始执行，直到遇到了下一个`yield`表达式。Genertor函数是分段执行的，`yield`表达式是暂停执行的标记，`next`恢复执行

```js
hw.next();//{value: 'hello', done: false}
hw.next();//{value: 'world', done: false}
hw.next();//{value: 'ending', done: true}
hw.next();//{value: undefined, done: true}
```



## yield函数

遍历器对象的`next`方法运行逻辑

1. 遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的表达式的值，作为返回对象的`value`属性值
2. 下一次调用`next`方法，继续向下执行，直到遇到下一个`yield`表达式
3. 如果没有新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后表达式的值，作为返回对象的`value`属性值
4. 如果函数没有`return`语句，则返回的对象的`value`属性值为`undefined`



## 异步应用

### 协程

多个线程互相协作，完成异步任务

运行流程：

1. 协程A开始执行
2. 协程A执行到一半，暂停，执行权转移到协程B
3. （一段时间后）协程B交还执行权
4. 协程A恢复执行

协程A就是异步任务，因为它分两段或多段执行

```js
function* asyncJob() {
    //some code
    var f = yield readFile(fileA);
    //some code
}
```

`asyncJob`是一个协程，其中的`yield`命令，表示执行到此处，把执行权交给其他协程，`yield`是异步两个阶段的分界线



### 协程Generator函数实现

整个Generator函数就是一个封装的异步任务，或者说是异步任务的容器

### Generator函数的数据交换和错误处理

可以暂停和恢复执行

函数体内外的数据交换和错误处理机制

`next`返回值的value属性，是Generator函数向外输出数据 

`next`方法还可以接收参数，向Generator函数体内输入数据

```js
function* gen(x){
    var y = yield x + 2;
    return y;
}
var g = gen(1);
g.next();//{value: 3, done: false}
g.next(2);//{value: 2, done: true},把参数传入，作为上个阶段异步任务的返回结果，被函数体内的变量y接收
```



# async函数

```js
const gen = function* () {
    const f1 = yield readFile('/etc/fstab');
    const f2 = yield readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}

const asyncReadFile = async function () {
    const f1 = await readFile('/etc/fstab');
    const f2 = await readFile('/etc/shells');
    console.log(f1.toString());
    console.log(f2.toString());
}
```

1. 内置执行器，直接执行
2. 返回值是promise对象



# fetch

 交互用的，ajax

ajax fetch socket...

fetch -> es promise对象

promise <->成功 o r失败	异步

resolve-决定

reject-拒绝

```js
new Promise((res,rej)=>{
    res();
    //rej();
}).then(()=>{
    //...
}).catch(()=>{
    //...
})
```



## Fetch API

提供了一个JavaScript接口，用于访问和操纵HTTP管道的部分，eg：请求和响应

提供了一个全局的`fetch()`方法，一种简单合理的方式来跨网络异步获取资源

与`jQuery.ajax()`的不同

* 当接收到一个代表错误的HTTP状态码时，从`fetch()`返回的Promise **不会被标记为reject**，即使该HTTP响应的状态码为404或500 。 它会将Promise状态标记为resolve（会将resolve的返回值`ok`属性设置为false）。*仅当网络故障或请求被阻止时。才会标记为reject*
* 默认，`fetch` **不会从服务端发送或接收任何cookies**，如果站点依赖于用户session，则会导致未经认证（想要发送cookie，必须设置`credentials`选项）

## fetch()

`fetch()`用于发起获取资源的请求，返回一个`promise`

该`promise`会在请求响应后被resolve，并传回`Response`对象

当遇到网络错误时，`fetch()`返回的promise会被reject，并传回`TypeError`

成功的`fetch()`检查，不仅包含promise被resolve，还包括`Response.ok`属性为true



## 进行fetch请求

```js
fetch('http://example.com/movies.json')//只传入了url
          .then(function (response) {//返回了一个promise然后操作
            return response.json();//返回一个promise对象
          })
          .then(function (myJson) {
            console.log(myJson);
          })
```



### Body

代表响应/请求的正文，允许声明其内容类型以及如何处理

`Body`被`Request`和`Response`实现，并为这些对象提供一个相关联的主体（字节流），一个已使用的标志（最初未设置）和一个MIME类型（最初为空字节序列）

#### 属性

`Body.body`只读

一个简单的getter用于暴露一个`ReadableStream`类型的主体内容

`Body.bodyUsed`只读

一个Boolean值指示是否body以及被标记读取

#### 方法

`Body.arrayBuffer()`二进制

使`Response`挂起一个流操作并在完成时读取其值，它返回一个`Promise`对象，其resolve参数类型是`ArrayBuffer`。此操作会将`bodyUsed`状态改为已使用（true）

`Body.blob()`文件

使`Response`挂起一个流操作并在完成时读取其值，它返回一个`Promise`对象，其resolve参数类型是`Blob`。此操作会将`bodyUsed`状态改为已使用（true）

`Body.formData()`

使`Response`挂起一个流操作并在完成时读取其值，它返回一个`Promise`对象，其resolve参数类型是`FormData`表单。此操作会将`bodyUsed`状态改为已使用（true）

`Body.json()`

使`Response`挂起一个流操作并在完成时读取其值，它返回一个`Promise`对象，其resolve参数类型是使用`JSON`解析body文本的结果。此操作会将`bodyUsed`状态改为已使用（true）

`Body.text()`

使`Response`挂起一个流操作并在完成时读取其值，它返回一个`Promise`对象，其resolve参数类型是`USVString`文本。此操作会将`bodyUsed`状态改为已使用（true）



### Request

Fetch API的Request的接口，用来表示资源请求

### Response

Fetch API的Response的接口呈现了对一次请求的响应数据



## fetch的语法以及一些参数

参数

`?input`

定义要获取的资源。可能是：

* 一个`USVString`字符串，包含要获取资源的URL。一些浏览器会接受`blob:`和`data:`作为schemes
* 一个`Request`对象

`init`可选

一个配置项对象，包括所有请求的设置。可选参数

* method：请求使用的方法如`GET` 、`POST `

* headers：请求的头信息，形式为`Headers`的对象或包含`ByteString`值的对象字面量

* body：请求的body信息，GET和HEAD方法的请求不能包含body信息

* mode：请求的模式，如`cors` `no-cors`或者`same-origin`

  ....太多了不想写



返回值

一个`Promise`,resolve实时回传`Response`对象





