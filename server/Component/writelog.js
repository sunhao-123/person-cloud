const fs = require('fs-extra');
const getTime = require('./gettime')
const consolelog = require('./consolelog')

const writelog = (path, type, log) => {
    let newLogFilePath = path.replace(".log", `${getTime("_YYYYMMDD")}.log`)

    /* 路径按"/"拆分，截取出文件夹路径 Start */
    let patharr = path.split("/")
    patharr.pop()
    let folderpath = patharr.join("/")
    /* 路径按"/"拆分，截取出文件夹路径 End*/

    //自动创建文件夹（fs-extra功能，原生fs没有此功能）
    fs.ensureDir(folderpath, (err) => {
        if (err) {
            fs.writeFile(
                `C:\\Users\\18504\\Desktop\\1.txt`,
                getTime("【YYYY-MM-DD HH:mm:ss.SSS】") + "日志文件夹创建失败！" + err + "\r\n",
                { flag: "a" },
                (error) => {
                    if (!error) return;
                    consolelog(3, "日志写入出错" + error);
                }
            );
            throw err
        } else {
            if (log === "start") {
                fs.writeFile(
                    newLogFilePath,
                    "==============================" + getTime("【YYYY-MM-DD】") + "==============================" + "\r\n" +
                    getTime("【YYYY-MM-DD HH:mm:ss.SSS】") + "【INFO】   服务启动成功！" + "\r\n",
                    { flag: "a" },
                    (error) => {
                        if (!error) return;
                        consolelog(3, "日志写入出错" + error);
                    }
                );
            } else {
                let flag = type === 1 ? "【INFO】   " : type === 2 ? "【WARNING】" : type === 3 ? "【ERROR】  " : type === 4 ? "【NET】 " : "【UNKNOWN】"
                fs.writeFile(
                    newLogFilePath,
                    getTime("【YYYY-MM-DD HH:mm:ss.SSS】") + flag + log + "\r\n",
                    { flag: "a" },
                    (error) => {
                        if (!error) return;
                        consolelog(3, "日志写入出错" + error);
                    }
                );
            }
        }
    })
}

module.exports = writelog
/*
*日志存储模块
*调用方法:
*writelog(String: "日志文件路径", String: "日志内容");
*日志开始记录:
*writelog(String: "日志文件路径", String: "start");

//if (log === "start") {
//    fs.writeFileSync(
//        newLogFilePath,
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