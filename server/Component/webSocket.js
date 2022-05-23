const fs = require('fs-extra');
const path = require('path');
const ws = require("nodejs-websocket")
const consolelog = require('./consolelog');
const writelog = require('./writelog');
const writelogsql = require('./writelogsql');
const getTime = require('./gettime');
const runSql = require('../db/datebase');

let config
let haveRedisConfig = fs.existsSync(path.join(process.cwd(), '/config/Server_config.json'))
if (haveRedisConfig) {
    config = require(path.join(process.cwd(), '/config/Server_config.json'))
    writelog("./log/SystemLog/SystemLog.log", 1, `Server_config 配置文件读取成功！`)
} else {
    consolelog(3, "服务配置文件丢失，请联系供应商解决!")
    writelog("./log/SystemLog/SystemLog.log", 3, `服务配置文件丢失，请联系供应商解决！`)
}

var websocketPort
try {
    websocketPort = config.websocketPort;
} catch {
    consolelog(2, "未找到服务配置文件，使用默认8082端口!")
    writelog("./log/SystemLog/SystemLog.log", 2, `未找到服务配置文件，使用默认8082端口！`)
    websocketPort = "8082";
}

let websocketConf = () => {
    let stationKey = {
        station1: "",
        station2: "",
        station3: ""
    }

    var wsserver = ws.createServer(function (conn) {
        conn.on("text", function (str) {
            if (/station/.test(str)) {
                stationKey[str] = conn.key
                conn.sendText(str.replace(/station/ig, "工位") + "连接成功！")
                consolelog(1, "ID: " + conn.key + " 已绑定到 " + str.replace(/station/ig, "工位") + "！")
                writelog("./log/SystemLog/SystemLog.log", 1, "ID: " + conn.key + " 已绑定到 " + str.replace(/station/ig, "工位") + "！")
                let sql1 = `SELECT TOP 1 "creatTime" FROM dbo.t_PickListStation${str.replace(/station/ig, "")} WHERE ([isFinish] = '${false}') ORDER BY creatTime DESC`
                runSql(sql1)
                    .then(data1 => {
                        if (data1.recordset.length > 0) {
                            writelog("./log/SystemLog/SystemLog.log", 1, `获取更新时间成功！`)
                            writelogsql(1, `获取更新时间成功！`)
                            conn.sendText("最新任务时间：" + getTime("YYYY-MM-DD HH:mm:ss.SSS", new Date(data1.recordset[0].creatTime).getTime() - (1000 * 60 * 60 * 8)))
                        } else {
                            writelog("./log/SystemLog/SystemLog.log", 1, `获取更新时间成功，但数据库中无任务！`)
                            writelogsql(1, `获取更新时间成功，但数据库中无任务！`)
                            conn.sendText("获取更新时间成功，但数据库中无任务！")
                        }
                    })
                    .catch(err => {
                        writelog("./log/SystemLog/SystemLog.log", 1, `获取更新时间失败！${err}`)
                        writelogsql(1, `获取更新时间失败！${err}`)
                        conn.sendText("获取更新时间失败！" + err)
                    })
            } else if (/^心跳$/.test(str)) {
                for (let i = 0; i < 3; i++) {
                    // let conn1 = wsserver.connections[i]
                    if (conn.key === stationKey["station" + (i + 1)]) {
                        conn.sendText("工位" + (i + 1) + "心跳OK")
                        writelog("./log/SystemLog/SystemLog.log", 1, "工位" + (i + 1) + "心跳OK")
                        writelogsql(1, "工位" + (i + 1) + "心跳OK")
                        break;
                    }
                }
            } else {
                // console.log(stationKey)
                consolelog(1, conn.key + " 发送：" + str)
                writelog("./log/SystemLog/SystemLog.log", 1, "收到数据：" + conn.key + "  发送：" + str)
                conn.sendText("后端收到数据：" + conn.key + "  send： " + str)
            }
        })
        conn.on("close", function (code, reason) {
            // consolelog(1, conn.key + " 断开")
            for (let i = 0; i < 3; i++) {
                // let conn1 = wsserver.connections[i]
                if (conn.key === stationKey["station" + (i + 1)]) {
                    consolelog(1, "工位" + (i + 1) + "断开")
                    writelog("./log/SystemLog/SystemLog.log", 1, "工位" + (i + 1) + "断开")
                    writelogsql(1, "工位" + (i + 1) + "断开")
                    break;
                }
            }
        })
        conn.on("error", function (err) {
            if (err + "" !== "Error: read ECONNRESET") {
                consolelog(3, "websocket error: " + err)
                writelog("./log/SystemLog/SystemLog.log", 1, "websocket error: " + err)
                writelogsql(1, "websocket error: " + err)
            }
        })
    }).listen(websocketPort)

    wsserver.on("listening", function () {
        consolelog(1, `websocket运行在` + '\033[42;30m ' + `${websocketPort}` + ' \033[0m端口！')
        writelog("./log/SystemLog/SystemLog.log", 1, `websocket运行在 ${websocketPort} 端口！`)
    })
    wsserver.on("close", function () {
        consolelog(2, "websocket 已关闭！")
        writelog("./log/SystemLog/SystemLog.log", 2, "websocket 已关闭！")
    })
    wsserver.on("error", function (errObj) {
        consolelog(3, "websocket 错误！" + errObj)
        writelog("./log/SystemLog/SystemLog.log", 3, "websocket 错误！" + errObj)
    })
    wsserver.on("connection", function (conn) {
        consolelog(1, "ID: " + conn.key + " 连入websocket成功！")
        writelog("./log/SystemLog/SystemLog.log", 1, "ID: " + conn.key + " 连入websocket成功！")
    })

    // let i = 0;
    // setInterval(function () {
    //     // console.log(server.connections)
    //     // if (connect) {
    //     i++;
    //     wsserver.connections.forEach(function (conn) {
    //         if (conn.key == stationKey["station1"]) {
    //             conn.sendText("循环发送次数 " + i)
    //         }
    //     })
    //     // }
    // }, 1000)

    return { stationKey, wsserver }
}
// websocketConf()

// consolelog(1, "11233" + websocketConf().wsserver)

module.exports = websocketConf