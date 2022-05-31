const express = require("express");
const runSql = require('../../db/datebase');
const writelog = require('../../Component/writelog');
const writelogsql = require('../../Component/writelogsql');
const getTime = require('../../Component/gettime');
const consolelog = require("../../Component/consolelog");

const router = express.Router();

router.get("/AutoCalloff", (req, res) => {
    let partnumber = req.query.partnumber
    let location = req.query.location
    let timestamp = req.query.timestamp * 1
    let username = req.query.username
    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} Call料==>零件号：${partnumber}，库位：${location}，时间：${getTime("YYYY-MM-DD HH:mm:ss", timestamp)}`)
    writelogsql(1, `用户：${username} Call料==>零件号：${partnumber}，库位：${location}，时间：${getTime("YYYY-MM-DD HH:mm:ss", timestamp)}`)
    res.send({
        code: 0,
        message: `Call料成功，已收到Call料信息。零件号：${partnumber}，库位：${location}，时间戳：${timestamp}`,
    })
})

// AutoCalloff?partnumber=123&location=123&timestamp=1234567890

router.get("/getList", (req, res) => {
    let passData = req.query
    if (!passData.username || !passData.station) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/getList 接口但参数缺失！`)
        writelogsql(2, `访问 /api/getList 接口但参数缺失！`)
        consolelog(2, `访问 /api/getList 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let username = passData.username
        let station = passData.station
        let sql1 = `SELECT "orderNum", "PlanCurSeq", "PlanPreSeq", "creatTime" FROM dbo.t_PickListStation${station} WHERE ([isFinish] = '${false}') ORDER BY PlanCurSeq`
        runSql(sql1)
            .then(data1 => {
                if (data1) {
                    // console.log(data1.recordset)
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 获取订单序列成功！`)
                    writelogsql(1, `用户：${username} 获取订单序列成功！`)
                    // console.log(data1.recordset)
                    res.send({
                        code: 0,                       // 0: 状态OK   其他数字: 错误代码
                        message: "查询成功",            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                        num: data1.recordset.length,                       // 列表总数量  查询失败时无此信息
                        list: data1.recordset,
                        createDateTime: getnewTime(data1.recordset),
                    })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 获取订单序列成功！`)
                    writelogsql(1, `用户：${username} 获取订单序列成功！`)
                    res.send({
                        code: 3,                       // 0: 状态OK   其他数字: 错误代码
                        message: "查询失败，未知错误！"
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 获取订单序列失败！${err}`)
                writelogsql(3, `用户：${username} 获取订单序列失败！${err}`)
                consolelog(3, `用户：${username} 获取订单序列失败！`)
                res.send({
                    code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    message: "查询失败，" + err,            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                })
            })
    }
})


router.get("/finishTask", (req, res) => {
    let passData = req.query
    if (!passData.username || !passData.station || !passData.lastTask) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/finishTask 接口但参数缺失！`)
        writelogsql(2, `访问 /api/finishTask 接口但参数缺失！`)
        consolelog(2, `访问 /api/finishTask 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let username = passData.username
        let station = passData.station
        let lastTask = passData.lastTask
        let sql = `UPDATE dbo.t_PickListStation${station} SET "isFinish" = '${true}', "updateTime" = '${getTime("YYYY-MM-DD HH:mm:ss.SSS")}' WHERE "orderNum" = '${lastTask}'`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] > 0) {
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 订单 ${lastTask} 已完成！`)
                    writelogsql(1, `用户：${username} 订单 ${lastTask} 已完成！`)
                    res.send({
                        code: 0,                       // 0: 状态OK   其他数字: 错误代码
                        message: `任务 ${lastTask} 已完成！`,            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                    })
                    // let sql1 = `SELECT TOP 1 "creatTime" FROM dbo.t_PickListStation${station} WHERE ([isFinish] = '${false}') ORDER BY creatTime DESC`
                    // runSql(sql1)
                    //     .then(data1 => {
                    //         if (data1) {
                    //             writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 获取订单序列成功！`)
                    //             writelogsql(1, `用户：${username} 获取订单序列成功！`)
                    //             res.send({
                    //                 code: 0,                       // 0: 状态OK   其他数字: 错误代码
                    //                 message: "查询成功",            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                    //                 createDateTime: getTime("YYYY-MM-DD HH:mm:ss.SSS", new Date(data1.recordset[0].creatTime).getTime() - (1000 * 60 * 60 * 8))
                    //             })
                    //         } else {
                    //             writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 获取订单序列成功！`)
                    //             writelogsql(1, `用户：${username} 获取订单序列成功！`)
                    //             res.send({
                    //                 code: 3,                       // 0: 状态OK   其他数字: 错误代码
                    //                 message: "查询失败，未知错误！"
                    //             })
                    //         }
                    //     })
                    //     .catch(err => {
                    //         writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 获取订单序列失败！${err}`)
                    //         writelogsql(3, `用户：${username} 获取订单序列失败！${err}`)
                    //         consolelog(3, `用户：${username} 获取订单序列失败！`)
                    //         res.send({
                    //             code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    //             message: "查询失败，" + err,            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                    //         })
                    //     })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 关闭订单失败，已完成完成订单号 ${lastTask} 错误！`)
                    writelogsql(3, `用户：${username} 关闭订单失败，已完成完成订单号 ${lastTask} 错误！`)
                    consolelog(3, `用户：${username} 关闭订单失败，已完成完成订单号 ${lastTask} 错误！`)
                    res.send({
                        code: 1,                       // 0: 状态OK   其他数字: 错误代码
                        message: `订单关闭失败，已完成完成订单号 ${lastTask} 错误！`,            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 完成数据写入失败！${err}`)
                writelogsql(3, `用户：${username} 完成数据写入失败！${err}`)
                consolelog(3, `用户：${username} 完成数据写入失败！`)
                res.send({
                    code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    message: "完成数据写入失败，" + err,            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                })
            })
    }
})

function getnewTime(data) {
    let date = 0
    data.forEach(item => {
        let s = new Date(item.creatTime).getTime() - (1000 * 60 * 60 * 8)
        if (s > date) {
            date = s
        }
    })
    return getTime("YYYY-MM-DD HH:mm:ss.SSS", date)
}

router.get("/getThresholdTime", (req, res) => {
    let passData = req.query
    if (!passData.LabelID || !passData.username || !passData.station) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/getThresholdTime 接口但参数缺失！`)
        writelogsql(2, `访问 /api/getThresholdTime 接口但参数缺失！`)
        consolelog(2, `访问 /api/getThresholdTime 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let LabelID = passData.LabelID
        let username = passData.username
        let station = passData.station
        let sql = `SELECT "Threshold_Time" FROM dbo.t_SmallPartList WHERE [LabelID] = '${LabelID}' AND [Station] = '工位${station}'`
        runSql(sql)
            .then(data => {
                if (data) {
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值成功！`)
                    writelogsql(1, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值成功！`)
                    res.send({
                        code: 0,
                        msg: "查询成功！",
                        time: data.recordset[0].Threshold_Time ? data.recordset[0].Threshold_Time : 0
                    })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值失败！${station}标签 ${LabelID} 不存在！`)
                    writelogsql(2, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值失败！${station}标签 ${LabelID} 不存在！`)
                    consolelog(2, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值失败！${station}标签 ${LabelID} 不存在！`)
                    res.send({
                        code: 1,
                        msg: `查询失败，${station}标签 ${LabelID} 不存在！`
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值失败！${err}`)
                writelogsql(3, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值失败！${err}`)
                consolelog(3, `用户：${username} 查询${station}标签 ${LabelID} 时间阈值失败！`)
                res.send({
                    code: 4,
                    msg: `${station}时间阈值失败: ${err}`
                })
            })
    }
})

router.get("/getPrintInfo", (req, res) => {
    let passData = req.query
    if (!passData.order || !passData.station || !passData.username) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/getPrintInfo 接口但参数缺失！`)
        writelogsql(2, `访问 /api/getPrintInfo 接口但参数缺失！`)
        consolelog(2, `访问 /api/getPrintInfo 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let order = passData.order
        let username = passData.username
        let station = passData.station
        let sql = `SELECT "orderNum", "PlanCurSeq", "PlanPreSeq", "Plant", "CarSet", "Family", "Part_blgroup", "VIN", "creatTime" FROM dbo.t_PickListStation${station} WHERE ([orderNum] = '${order}')`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] > 0) {
                    let result = {
                        orderNum: data.recordset[0].orderNum,
                        PlanCurSeq: data.recordset[0].PlanCurSeq,
                        PlanPreSeq: data.recordset[0].PlanPreSeq,
                        Plant: data.recordset[0].Plant,
                        CarSet: data.recordset[0].CarSet,
                        Family: data.recordset[0].Family,
                        blgroup: data.recordset[0].Part_blgroup,
                        VIN: data.recordset[0].VIN,
                        creatTime: data.recordset[0].creatTime
                    }
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询订单号 ${order} 打印信息成功！`)
                    writelogsql(1, `用户：${username} 查询订单号 ${order} 打印信息成功！`)
                    res.send({
                        code: 0,
                        message: `获取订单号 ${order} 打印信息成功`,
                        data: result
                    })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 查询订单号 ${order} 失败！订单号不存在！`)
                    writelogsql(2, `用户：${username} 查询订单号 ${order} 失败！订单号不存在！`)
                    consolelog(2, `用户：${username} 查询订单号 ${order} 失败！订单号不存在！`)
                    res.send({
                        code: 1,                       // 0: 状态OK   其他数字: 错误代码
                        message: `查询失败，订单号不存在！`
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询订单号 ${order} 失败！服务器错误：${err}`)
                writelogsql(3, `用户：${username} 查询订单号 ${order} 失败！服务器错误：${err}`)
                consolelog(3, `用户：${username} 查询订单号 ${order} 失败！`)
                res.send({
                    code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    message: `查询失败，服务器错误：${err}`
                })
            })
    }
})

router.get("/getBom", (req, res) => {
    let passData = req.query
    if (!passData.order || !passData.station || !passData.username) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/getBom 接口但参数缺失！`)
        writelogsql(2, `访问 /api/getBom 接口但参数缺失！`)
        consolelog(2, `访问 /api/getBom 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let order = passData.order
        let username = passData.username
        let station = passData.station
        let sql = `SELECT "PlanCurSeq", "PlanPreSeq", "CarSet", "Part_blgroup", "Part_LearId", "Part_Qty", "XID", "isFinish" FROM dbo.t_PickListStation${station} WHERE ([orderNum] = '${order}')`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] > 0) {
                    if (data.recordset[0].isFinish) {
                        writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询订单号 ${order} 成功，但该任务已完成。`)
                        writelogsql(1, `用户：${username} 查询订单号 ${order} 成功，但该任务已完成。`)
                        // console.log(data)
                        res.send({
                            code: 5,
                            message: `订单号 ${order} 已拣选完成，无需重复拣选。`
                        })
                    } else {
                        let result = {
                            PlanCurSeq: data.recordset[0].PlanCurSeq,
                            PlanPreSeq: data.recordset[0].PlanPreSeq,
                            CarSet: data.recordset[0].CarSet,
                            blgroup: data.recordset[0].Part_blgroup,
                            Part: [],
                            XID: data.recordset[0].XID,
                        }
                        getPart(data.recordset[0].Part_LearId.split(","), data.recordset[0].Part_Qty.split(","), station)
                            .then(data => {
                                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询订单号 ${order} 成功！`)
                                writelogsql(1, `用户：${username} 查询订单号 ${order} 成功！`)
                                // console.log(data)
                                result.Part = data
                                res.send({
                                    code: 0,
                                    message: `订单号 ${order} 查询成功`,
                                    data: result
                                })
                            })
                            .catch(err => {
                                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询订单号 ${order} 失败！订单中小零件号查询错误：${err}`)
                                writelogsql(3, `用户：${username} 查询订单号 ${order} 失败！订单中小零件号查询错误：${err}`)
                                consolelog(3, `用户：${username} 查询订单号 ${order} 失败！订单中小零件号查询错误。`)
                                res.send({
                                    code: 2,
                                    message: `查询订单号 ${order} 失败，订单中小零件号查询错误：${err}`
                                })
                            })
                    }
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 查询订单号 ${order} 失败！订单号不存在！`)
                    writelogsql(2, `用户：${username} 查询订单号 ${order} 失败！订单号不存在！`)
                    consolelog(2, `用户：${username} 查询订单号 ${order} 失败！订单号不存在！`)
                    res.send({
                        code: 1,                       // 0: 状态OK   其他数字: 错误代码
                        message: `查询失败，订单号不存在！`
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询订单号 ${order} 失败！服务器错误：${err}`)
                writelogsql(3, `用户：${username} 查询订单号 ${order} 失败！服务器错误：${err}`)
                consolelog(3, `用户：${username} 查询订单号 ${order} 失败！`)
                res.send({
                    code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    message: `查询失败，服务器错误：${err}`
                })
            })
    }
})

function pn2name(pn, station) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT [PartName], [LabelID] FROM dbo.t_SmallPartList WHERE ([PartNum] = '${pn}' AND [Station] = '工位${station}')`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] != 0) {
                    let result = data.recordset
                    let overData = {
                        name: "",
                        LabelID: []
                    }
                    result.forEach(item => {
                        overData.name = item.PartName
                        overData.LabelID.push(item.LabelID)
                    })
                    resolve(overData)
                } else {
                    reject(`未查询到零件号： ${pn}，小零件号错误！`)
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

async function getPart(Part_LearId, Part_Qty, station) {
    let num = Part_LearId.length
    let partArr = []
    for (let i = 0; i < num; i++) {
        let obj = await pn2name(Part_LearId[i], station)
        let name = obj.name
        let LabelID = obj.LabelID
        partArr.push({
            LearId: Part_LearId[i],
            name: name,
            LabelID: LabelID,
            Qty: Part_Qty[i],
        })
    }
    return partArr
}

router.get("/id2pn", (req, res) => {
    let passData = req.query
    if (!passData.labelID || !passData.username || !passData.station) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/id2pn 接口但参数缺失！`)
        writelogsql(2, `访问 /api/id2pn 接口但参数缺失！`)
        consolelog(2, `访问 /api/id2pn 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let username = passData.username
        let id = passData.labelID
        let station = passData.station
        let sql = `SELECT * FROM dbo.t_SmallPartList WHERE ([LabelID] = '${id}' AND [Station] = '工位${station}')`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] != 0) {
                    let resualt = data.recordset[0]
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询库位零件号成功！${id}==>${resualt.PartNum}/${resualt.PartName}`)
                    writelogsql(1, `用户：${username} 查询库位零件号成功！${id}==>${resualt.PartNum}/${resualt.PartName}`)
                    res.send({
                        code: 0,                       // 0: 状态OK   其他数字: 错误代码
                        message: "查询成功",            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                        pn: resualt.PartNum,
                        name: resualt.PartName
                    })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 查询库位零件号失败，标签ID ${id} 不存在！`)
                    writelogsql(2, `用户：${username} 查询库位零件号失败，标签ID ${id} 不存在！`)
                    consolelog(2, `用户：${username} 查询库位零件号失败，标签ID ${id} 不存在！`)
                    res.send({
                        code: 1,                       // 0: 状态OK   其他数字: 错误代码
                        message: "查询失败，数据不存在"             // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询库位零件号失败，服务器错误！${err}`)
                writelogsql(3, `用户：${username} 查询库位零件号失败，服务器错误！${err}`)
                consolelog(3, `用户：${username} 查询库位零件号失败！`)
                res.send({
                    code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    message: `查询失败，${err}`
                })
            })
    }
})

router.get("/pn2id", (req, res) => {
    let passData = req.query
    if (!passData.partNum || !passData.username || !passData.station) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/pn2id 接口但参数缺失！`)
        writelogsql(2, `访问 /api/pn2id 接口但参数缺失！`)
        consolelog(2, `访问 /api/pn2id 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let username = passData.username
        let pn = passData.partNum
        let station = passData.station
        let sql = `SELECT * FROM dbo.t_SmallPartList WHERE ([PartNum] = '${pn}' AND [Station] = '工位${station}')`
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] != 0) {
                    let resualt = data.recordset
                    let idArr = []
                    resualt.forEach(item => {
                        idArr.push(item.LabelID)
                    });
                    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询零件号所在库位成功！${pn}==>${idArr.join(", ")}`)
                    writelogsql(1, `用户：${username} 查询零件号所在库位成功！${pn}==>${idArr.join(", ")}`)
                    res.send({
                        code: 0,                       // 0: 状态OK   其他数字: 错误代码
                        message: "查询成功",            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                        IDs: idArr,
                    })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 查询零件号所在库位失败，零件号 ${pn} 不存在！`)
                    writelogsql(2, `用户：${username} 查询零件号所在库位失败，零件号 ${pn} 不存在！`)
                    consolelog(2, `用户：${username} 查询零件号所在库位失败，零件号 ${pn} 不存在！`)
                    res.send({
                        code: 1,                       // 0: 状态OK   其他数字: 错误代码
                        message: `查询失败，零件号 ${pn} 不存在`,            // 查询成功 或 查询失败【ERROR】  ： + 错误信息
                    })
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询零件号所在库位失败，服务器错误！${err}`)
                writelogsql(3, `用户：${username} 查询零件号所在库位失败，服务器错误！${err}`)
                consolelog(3, `用户：${username} 查询零件号所在库位失败！`)
                res.send({
                    code: 4,                       // 0: 状态OK   其他数字: 错误代码
                    message: `查询失败：${err}`
                })
            })
    }
})

router.post("/login", (req, res) => {
    // console.log(req.body)
    let passData = req.body
    if (!passData.user || !passData.pwd || !passData.station) {
        writelog("./log/SystemLog/SystemLog.log", 2, `访问 /api/login 接口但参数缺失！`)
        writelogsql(2, `访问 /api/login 接口但参数缺失！`)
        consolelog(2, `访问 /api/login 接口但参数缺失！`)
        res.send({
            code: 5,
            msg: "查询失败，参数缺失！"
        })
    } else {
        let username = passData.user
        let password = passData.pwd
        let station = passData.station
        runSql(
            "SELECT * FROM dbo.t_user " +
            `WHERE username = '${username}'`
        )
            .then(data => {
                if (data.rowsAffected[0] === 0) {
                    res.send({
                        code: 1,
                        msg: "登录失败，用户名不存在！"
                    });
                } else {
                    if (data.recordset[0].password !== password) {
                        writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 在PBL系统登录，密码错误！`)
                        writelogsql(2, `用户：${username} 在PBL系统登录，密码错误！`)
                        consolelog(2, `用户：${username} 在PBL系统登录，密码错误！`)
                        res.send({
                            code: 2,
                            msg: "登录失败，密码错误！"
                        });
                    } else {
                        if (data.recordset[0][`station${station}`]) {
                            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 在PBL系统登录成功！`)
                            writelogsql(1, `用户：${username} 在PBL系统登录成功！`)
                            //返回前端
                            res.send({
                                code: 0,
                                msg: "登录成功",
                                isAdmin: data.recordset[0].isAdmin
                            });
                        } else {
                            writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 在PBL系统登录失败，权限不足！`)
                            writelogsql(2, `用户：${username} 在PBL系统登录失败，权限不足！`)
                            consolelog(2, `用户：${username} 在PBL系统登录失败，权限不足！`)
                            //返回前端
                            res.send({
                                code: 4,
                                msg: "登录失败，权限不足！"
                            });
                        }
                    }
                }
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 在PBL系统登录失败，服务器错误！${err}`)
                writelogsql(3, `用户：${username} 在PBL系统登录失败，服务器错误！${err}`)
                consolelog(3, `用户：${username} 在PBL系统登录失败！`)
                res.send({
                    code: 4,
                    msg: "登录失败！" + err
                });
            })
    }
});

router.use("/reprint", require('./reprint'));

module.exports = router;