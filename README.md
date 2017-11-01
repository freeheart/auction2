# auction2
==
AuctionII based on koa2 , socket.io , mongodb ...
--
-----
<br>

希望对`大家`有用。

* 一个基于socket.io的拍卖程序
* 通过KOA等集成了https和wss
* 万人Happy

-----
[![baidu]](https://www.baidu.com/s?wd=auction2)  
[baidu]:http://www.baidu.com/img/bdlogo.gif "百度Logo"  

-----
```javascript
"use strict";

const koa = require('koa');
const http = require('http');
const https = require('https');
const fs = require('fs');
const enforceHttps = require('koa-sslify');
const nunjucks = require('nunjucks');
const serve = require("koa-static-cache");
const router = require("./koarouter.js");
var io = require("./auction.io.js");
const koaBody = require('koa-body');

var app = new koa();

// Force HTTPS on all page
app.use(enforceHttps());

//静态网页服务挂载
app.use(serve({prefix:'/',dir:'./html',preload:false,dynamic:true}));

//上传文件的BODY对象绑定
app.use(koaBody({ multipart: true }));
//挂载动态页面
app
.use(router.routes())
.use(router.allowedMethods());

// SSL options
var options = {
    key: fs.readFileSync('./214242766250623.key'),  //ssl文件路径
    cert: fs.readFileSync('./214242766250623.pem')  //ssl文件路径
};

http.createServer(app.callback()).listen(80);

// Swi 最终的服务核心，处理https和wss的连接
var Swi=https.createServer(options, app.callback())
Swi.listen(443);

//io绑定
io.attach(Swi, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });
//初始化任务

let i=0;
const iTask= setInterval(x=>{
    console.log(i++ + ':'+io.man)
},5000);

// start the server
console.log('--Swi( http[S]-[W]eb-websocket.[I]o ) server is running--');
```
