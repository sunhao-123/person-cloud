var express = require('express');
var path = require('path');
var fs = require('fs-extra')
var cookieParser = require('cookie-parser');
var apiLogger = require('./Component/apiLogger');
var path = require("path");
const writelog = require('./Component/writelog');
const getTime = require('./Component/gettime');
const compression = require('compression');
//App实例
var app = express();
app.use(compression());//在var app = express();之后添加
//中间件设置
//自动创建文件夹（fs-extra包功能，原生fs包没有此功能）
fs.ensureDirSync('./log/NetworkLog/')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));

//设置session
app.use(require("./session/index"));

//允许跨域
app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    });
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

//网络日志
app.use(apiLogger);

//设置路由
app.use('/', require('./routes/index'));

module.exports = app;