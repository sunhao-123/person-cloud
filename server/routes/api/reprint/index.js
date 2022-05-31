const express = require("express");
const runSql = require('../../../db/datebase');
const writelog = require('../../../Component/writelog');
const writelogsql = require('../../../Component/writelogsql');
const getTime = require('../../../Component/gettime');
const consolelog = require("../../../Component/consolelog");

const router = express.Router();

router.get("/getReprintList", (req, res) => {
    let passData = req.query
    if (!passData.fromDate || !passData.toDate || !passData.username || !passData.station) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/getReprintList 接口但参数缺失！`)
        writelogsql(2, `访问 /api/getReprintList 接口但参数缺失！`)
        consolelog(2, `访问 /api/getReprintList 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let fromDate = getTime("YYYY-MM-DD HH:mm:ss", passData.fromDate * 1)
        let toDate = getTime("YYYY-MM-DD HH:mm:ss", passData.toDate * 1)
        let station = passData.station
        let username = passData.username

        let sql = `SELECT orderNum, fileTime, isFinish, updateTime FROM dbo.t_PickListStation${station} WHERE [isFinish] = '${true}' AND [updateTime] BETWEEN '${fromDate}' AND '${toDate}' ORDER BY fileTime`

        // 2022-03-29 00:00:00
        // 2022-03-30 14:10:00

        runSql(sql)
            .then(data => {
                if (data) {
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})成功！`)
                    writelogsql(1, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})成功！`)
                    res.send({
                        code: 0,
                        msg: "查询成功！",
                        data: data.recordset
                    })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})失败，未知错误！`)
                    writelogsql(3, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})失败，未知错误！`)
                    consolelog(3, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})失败，未知错误！`)
                    res.send({
                        code: 2,
                        msg: "查询失败，未知错误！"
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})失败，${err}`)
                writelogsql(3, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})失败，${err}`)
                consolelog(3, `用户：${username} 查询补打任务清单(${fromDate} 至 ${toDate})失败！`)
                res.send({
                    code: 4,
                    msg: "查询失败，" + err
                })
            })
    }
})

router.get("/addReprintLabel", (req, res) => {
    let passData = req.query
    if (!passData.username || !passData.station || !passData.order) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/reprint/addReprintLabel 接口但参数缺失！`)
        writelogsql(2, `访问 /api/reprint/addReprintLabel 接口但参数缺失！`)
        consolelog(2, `访问 /api/reprint/addReprintLabel 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "添加失败，参数缺失！"
        })
    } else {
        let username = passData.username
        let order = passData.order
        let station = passData.station
        let sql = `INSERT INTO dbo.t_reprintListStation${station} ("orderNum", "creatTime") VALUES ('${order}', '${getTime("YYYY-MM-DD HH:mm:ss.SSS")}')`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] > 0) {
                    let msg = `用户：${username} 添加补打信息 ${order} 成功！`
                    writelog("./log/SystemLog/SystemLog.log", 1, msg)
                    writelogsql(1, msg)
                    res.send({
                        code: 0,
                        msg: msg
                    })
                } else {
                    let msg = `用户：${username} 添加补打信息 ${order} 失败，未知错误！`
                    writelog("./log/SystemLog/SystemLog.log", 3, msg)
                    writelogsql(3, msg)
                    consolelog(3, msg)
                    res.send({
                        code: 3,
                        msg: msg
                    })
                }
            })
            .catch(err => {
                let msg = `用户：${username} 添加补打信息 ${order} 失败！` + err
                writelog("./log/SystemLog/SystemLog.log", 3, msg)
                writelogsql(3, msg)
                consolelog(3, `用户：${username} 添加补打信息 ${order} 失败！`)
                res.send({
                    code: 4,
                    msg: msg
                })
            })
    }
})

module.exports = router;