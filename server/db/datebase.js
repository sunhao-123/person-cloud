var sql = require('mssql');
const writelog = require('../Component/writelog');
const getTime = require('../Component/gettime');
const consolelog = require('../Component/consolelog');
// const createdatatable = require("../Component/createdatatable");
var fs = require("fs");
var path = require("path");

let config
let haveRedisConfig = fs.existsSync(path.join(process.cwd(), '/config/DB_config.json'))
if (haveRedisConfig) {
    config = require(path.join(process.cwd(), '/config/DB_config.json'))
    writelog("./log/SystemLog/SystemLog.log", 1, `DB_config 配置文件读取成功！`)
} else {
    consolelog(3, "数据库配置文件丢失，请联系供应商解决！")
    writelog("./log/SystemLog/SystemLog.log", 3, `数据库配置文件丢失，请联系供应商解决！`)
}

function connectSQL() {
    try {
        sql.connect(config)
            .then(() => {
                consolelog(1, "数据库连接成功！")
                writelog("./log/SystemLog/SystemLog.log", 1, `数据库连接成功！`)
                require("../Component/createdatatable");
            })
            .catch(err => {
                consolelog(3, "数据库连接失败！")
                consolelog(2, "数据库将在5s后自动重连！")
                writelog("./log/SystemLog/SystemLog.log", 3, `数据库连接失败！${err}`)
                setTimeout(function () { connectSQL() }, 5000)
            })
    } catch {
        consolelog(2, "未找到数据库配置文件，使用默认配置连接!")
        sql.connect({
            "user": "pickingtest",
            "password": "sunhao123",
            "server": "192.168.1.220",
            "port": 1433,
            "database": "CFAAPicking",
            "pool": {
                "max": 10,
                "min": 0,
                "idleTimeoutMillis": 9999999999
            },
            "options": {
                "encrypt": false,
                "enableArithAbort": true
            }
        })
            .then(() => {
                consolelog(1, "数据库连接成功！")
                writelog("./log/SystemLog/SystemLog.log", 1, `数据库连接成功！`)
                require("../Component/createdatatable");
            })
            .catch(err => {
                consolelog(3, "数据库连接失败！")
                consolelog(2, "数据库将在5s后自动重连！")
                writelog("./log/SystemLog/SystemLog.log", 3, `数据库连接失败！${err}`)
                setTimeout(function () { connectSQL() }, 5000)
            })
    }
}
connectSQL()

sql.on('error', err => {
    consolelog(3, "数据库错误！")
    writelog("./log/SystemLog/SystemLog.log", 3, `数据库错误！${err}`)
    connectSQL()
})

function runSql(sqltext) {
    writelog("./log/SQLLog/SQLLog.log", 5, `${sqltext}`)
    return new Promise((resolve, reject) => {
        sql.query(sqltext, (err, recordset) => {
            if (err) {
                consolelog(3, "数据库错误！" + `(${sqltext})`)
                writelog("./log/SystemLog/SystemLog.log", 3, `数据库执行错误！(${sqltext}) ==> ${err}`)
                reject(err)
            } else {
                resolve(recordset)
            }
        });
    })
}

module.exports = runSql