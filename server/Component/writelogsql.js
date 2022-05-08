const getTime = require('./gettime')
const runSql = require('../db/datebase');
const writelog = require('./writelog');
const consolelog = require('./consolelog');

const writelogsql = (type, log) => {
    let sql = ""
    if (type === 1) {
        sql = `INSERT INTO dbo.t_log ("cont", "creatTime") VALUES ('【INFO】${log.replace(/\'/, "\'\'")}', '${getTime("YYYY-MM-DD HH:mm:ss")}')`
    } else if (type === 2) {
        sql = `INSERT INTO dbo.t_log ("cont", "creatTime") VALUES ('【WARNING】${log.replace(/\'/, "\'\'")}', '${getTime("YYYY-MM-DD HH:mm:ss")}')`
    } else if (type === 3) {
        sql = `INSERT INTO dbo.t_log ("cont", "creatTime") VALUES ('【ERROR】${log.replace(/\'/, "\'\'")}', '${getTime("YYYY-MM-DD HH:mm:ss")}')`
    } else {
        sql = `INSERT INTO dbo.t_log ("cont", "creatTime") VALUES ('【UNKNOWN】${log.replace(/\'/, "\'\'")}', '${getTime("YYYY-MM-DD HH:mm:ss")}')`
    }
    runSql(sql)
        .then(() => {
            // writelog("./log/SystemLog/SystemLog.log", 1, `日志数据库写入成功！`)
        })
        .catch(err => {
            consolelog(3, `日志数据库写入失败！`)
            writelog("./log/SystemLog/SystemLog.log", 3, `日志数据库写入失败！${err}`)
        })
}

module.exports = writelogsql
/*
*日志存储模块
*调用方法:
*writelog(String: "日志文件路径", String: "日志内容");
*日志开始记录:
*writelog(String: "日志文件路径", String: "start");

//if (log === "start") {
//    fs.writeFileSync(
//        path,
//        "==============================" + getTime(2) + "==============================" + "\r\n" +
//        getTime("【YYYY-MM-DD HH:mm:ss】") + "软件启动成功！" + "\r\n",
//        { flag: "a" },
//        (error) => {
//            if (!error) return;
//            console.log("写入出错", error);
//        }
//    );
//}

*/