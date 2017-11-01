const Router = require('koa-router');
const path = require('path');
const mime = require('./mime_array.js')
const fs = require('fs');
const tool =require('./utils.js')

const up_pathroot = './html/media';
const up_urlroot  = '/media';

var router = new Router();
router.precode='file';

const h5_index = ctx => { //  '/'
    ctx.response.body = '<h1>Index</h1>';
};

const h5_hello = ctx => {  // '/hello/:name'
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
};

const h5_get = ctx => {  // '/get'
    let x=ctx.query.name;
    ctx.response.body = `<h1>Index</h1>
        <form action="/get" method="post">
            <p>Name: <input name="name" value="${x}"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>${x}`;
};

const h5_signin = ctx => {  // '/signin'
    if(ctx.request.body == null){  //没有发post数据
        ctx.response.body = '<h1>没有收到底层数据</h1>'
        return;
    }
    var
    name = ctx.request.body.name || '',
    password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
};
//上传文件
const h5_upload = async function(ctx) {  //上传input的file控件name=upfile
    const o =ctx.request.body.files.upfile;
    if(o==null)return;
    var ti = Date.now();
    var tipath = tool.fmtDate(ti,'');

    //单选一个文件上传
    if(o.length==null){
        let ty = mime.mimeType.indexOf(o.type);
        if(ty<0)return;
        //文件夹判断和创建
        if (!fs.existsSync(path.join(up_pathroot,mime.mediaType[ty],tipath))) {
            fs.mkdirSync(path.join(up_pathroot,mime.mediaType[ty],tipath))
        }
        //文件名确定
        let filePath = path.join(up_pathroot, mime.mediaType[ty] ,tipath, router.precode + ti + '_1' + mime.mimeExt[ty]);
        let urlPath  = path.join(up_urlroot,mime.mediaType[ty] ,tipath, router.precode + ti + '_1' + mime.mimeExt[ty]);

        //读写流
        const reader = fs.createReadStream(o.path);
        const writer = fs.createWriteStream(filePath);
        reader.pipe(writer);
        ctx.body=`{type:"file",mime:"${mime.mimeExt[ty]}",src:"${urlPath}"}`;
        return;
    }
    //多选文件上传
    const filePaths = [];
    for(let i=0;i<o.length;i++){
        let ty = mime.mimeType.indexOf(o[i].type);
        if(ty<0)continue;
        //文件夹判断和创建
        if (!fs.existsSync(path.join(up_pathroot,mime.mediaType[ty],tipath))) {
            fs.mkdirSync(path.join(up_pathroot,mime.mediaType[ty],tipath))
        }
        //文件名确定
        let filePath = path.join(up_pathroot, mime.mediaType[ty] ,tipath, router.precode + ti + '_' + i + mime.mimeExt[ty]);
        let urlPath  = path.join(up_urlroot,mime.mediaType[ty] ,tipath, router.precode + ti + '_' + i + mime.mimeExt[ty]);

        const reader = fs.createReadStream(o[i].path);
        const writer = fs.createWriteStream(filePath);
        reader.pipe(writer);
        filePaths.push(`{type:"file",mime:"${mime.mimeExt[ty]}",src:"${urlPath}"}`);
    }
    ctx.body=filePaths.join();
};

const h5_404 = ctx => { //  '/'
    ctx.response.body = '<h1>Index 404</h1>';
};

router
.get('/', h5_index)
.get('/hello/:name', h5_hello)
.get('/get', h5_get)
.get('/signin', h5_signin)
.post('/upload',h5_upload)
.get('*', h5_404);

module.exports=router;