const getTime = require("./gettime")
const runSql = require('../db/datebase');
const writelog = require('./writelog');
const uaParser = require("ua-parser-js")
const apiLogger = (req, res, next) => {
    let time = getTime("YYYY-MM-DD HH:mm:ss.SSS")
    next();
    let method = req.method
    let data = ""
    if(method.toUpperCase() === "POST"){
        data = JSON.stringify(req.body)
    } else if(method.toUpperCase() === "GET"){
        data = JSON.stringify(req.query)
    }
    // console.log(req)
    let httpVersion = "HTTP/" + req.httpVersion
    let url = req.originalUrl.split("?")[0]
    let clientIP = getClientIp(req)
    let clientUa = getClientUa(req)
    let clientSystem = getClientSystem(req)
    writelog("./log/NetworkLog/NetworkLog.log", 4, `${method}\t| ${httpVersion}\t| ${url}\t| ${clientIP}\t| ${clientUa}\t| ${clientSystem}`)
    let sql = `INSERT INTO dbo.t_Netlog ("time", "method", "httpVersion", "url", "data", "clientIP", "clientUa", "clientSystem") VALUES ('${time}','${method}','${httpVersion}','${url}','${data.replace("\'", "\'\'")}','${clientIP}','${clientUa}','${clientSystem}')`
    runSql(sql)
}

function getClientIp(req) {
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    let ip = ipAddress.replace(/::ffff:/g, '');
    return ip;
};

function getClientUa(req) {
    let ua = uaParser(req.headers['user-agent'])
    let clientUa = ""
    if (/Picking_Client/.test(ua.ua)) {
        let arr = ua.ua.split("/")
        let version = arr[arr.length - 1]
        clientUa = "PBL系统客户端/V" + version
    } else if(/PickingClient_Update/.test(ua.ua)){
        let arr = ua.ua.split("/")
        let version = arr[arr.length - 1]
        clientUa = "PBL系统更新程序/V" + version
    } else {
        clientUa = ua.browser.name ? ua.browser.name + "/" + ua.browser.version : "未知客户端"
    }
    return clientUa
}

function getClientSystem(req) {
    let ua = uaParser(req.headers['user-agent'])
    return ua.os.name ? ua.os.name + " " + ua.os.version : "未知操作系统"
}

module.exports = apiLogger