const express = require("express");
const runSql = require('../../db/datebase');
const crypto = require("crypto");
const path = require("path");
const fs = require("fs-extra");
const multer = require('multer');
const Excel = require('exceljs');
const getTime = require('../../Component/gettime');
const writelog = require('../../Component/writelog')
const writelogsql = require('../../Component/writelogsql');
const consolelog = require('../../Component/consolelog');
const SunArray = require('../../Component/SunArray');

let config
let haveRedisConfig = fs.existsSync(path.join(process.cwd(), '/config/Server_config.json'))
if (haveRedisConfig) {
    config = require(path.join(process.cwd(), '/config/Server_config.json'))
    writelog("./log/SystemLog/SystemLog.log", 1, `Server_config 配置文件读取成功！`)
} else {
    consolelog(3, "服务配置文件丢失，请联系供应商解决!")
    writelog("./log/SystemLog/SystemLog.log", 3, `服务配置文件丢失，请联系供应商解决！`)
}

const driver = config["Driver"];
const codriver = config["Co-driver"]
const backseat = config["backseat"]
const leanback = config["Lean-back"]

const router = express.Router();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/uploadFile'));
    },
    filename: function (req, file, cb) {
        let fileName = "Locetion_" + getTime("YYYYMMDD_HHmmss") + file.originalname.match(/\.(xlsx)$/i)[0];
        cb(null, fileName);
    }
});

let upload = multer({ storage }).single('file');

//获取料架信息
router.post("/getLocation", (req, res) => {
    let location = req.body.location;
    let station = req.body.station;
    let sql = `SELECT * FROM dbo.t_SmallPartList WHERE Station = '${station}' AND LabelID LIKE '0${location}[1-4][1-4]'`
    runSql(sql)
        .then(data => {
            if (data) {
                let result = data.recordset
                // console.log(result)
                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${req.session.login.username} 获取料架 0${location} 信息成功！`)
                writelogsql(1, `用户：${req.session.login.username} 获取料架 0${location} 信息成功！`)
                res.send({
                    code: 0,
                    data: result
                });
            } else {
                writelog("./log/SystemLog/SystemLog.log", 2, `用户：${req.session.login.username} 获取料架 0${location} 信息失败，未查询到结果。`)
                writelogsql(2, `用户：${req.session.login.username} 获取料架 0${location} 信息失败，未查询到结果。`)
                consolelog(2, `用户：${req.session.login.username} 获取料架 0${location} 信息失败，未查询到结果。`)
                res.send({
                    code: 1,
                    msg: "未查询到结果"
                });
            }
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${req.session.login.username} 获取料架 0${location} 信息失败，服务器错误！${err}`)
            writelogsql(3, `用户：${req.session.login.username} 获取料架 0${location} 信息失败，服务器错误！${err}`)
            consolelog(3, `用户：${req.session.login.username} 获取料架 0${location} 信息失败！`)
            // console.log(err)
            res.send({
                code: 4,
                msg: err
            });
        })
});

//更新料架信息
router.post("/updateLocation", (req, res) => {
    let data = req.body.data;
    updateSmallPartList(data)
        .then(updateResult => {
            // console.log(updateResult)
            if (updateResult.length === 0) {
                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${req.session.login.username} 更新料架信息成功！`)
                writelogsql(1, `用户：${req.session.login.username} 更新料架信息成功！`)
                res.send({
                    code: 0,
                    msg: "数据更新成功"
                });
            } else {
                let msg = ""
                updateResult.forEach(item => {
                    writelog("./log/SystemLog/SystemLog.log", 3, `用户：${req.session.login.username} 更新料架信息失败！${item.msg}`)
                    writelogsql(3, `用户：${req.session.login.username} 更新料架信息失败！${item.msg}`)
                    consolelog(3, `用户：${req.session.login.username} 更新料架信息失败！`)
                    msg += item.msg + "<br>"
                })
                res.send({
                    code: 1,
                    msg: msg
                });
            }
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${req.session.login.username} 更新料架信息失败，服务器错误！${err}`)
            writelogsql(3, `用户：${req.session.login.username} 更新料架信息失败，服务器错误！${err}`)
            consolelog(3, `用户：${req.session.login.username} 更新料架信息失败！`)
            res.send({
                code: 4,
                msg: "更新失败，服务器错误！"
            });
        })
});

async function updateSmallPartList(dataArr) {
    let resultData = []
    for (let i = 0; i < dataArr.length; i++) {
        // console.log(pnArr[i])
        let data = await update(dataArr[i])
        resultData.push(data)
    };
    let errorResult = []
    resultData.forEach(item => {
        if (item.code !== 0) {
            errorResult.push(item)
        }
    })
    return errorResult
}

function update(item) {
    return new Promise((resolve, reject) => {
        let sql = `UPDATE dbo.t_SmallPartList SET "PartNum" = '${item.PartNum}',"PartName" = '${item.PartName}',"Threshold_Time" = '${item.Threshold_Time}' WHERE LabelID = ${item.LabelID} AND Station = '${item.Station}'`
        // console.log(sql)
        runSql(sql)
            .then(data => {
                if (data.rowsAffected[0] == 1) {
                    let message = {
                        code: 0,
                        msg: `${item.LabelID}更新成功！`
                    }
                    resolve(message)
                } else {
                    resolve({
                        code: 1,
                        msg: `更新失败【ERROR】：未找到标签ID ${item.LabelID}`
                    })
                }
            })
            .catch(err => {
                resolve({
                    code: 4,
                    msg: `更新失败【ERROR】：${err}`
                })
            })
    })
}


//获取用户列表
router.get("/getuser", (req, res) => {
    runSql(
        "SELECT * FROM dbo.t_user"
    )
        .then(data => {
            let dataarr = data.recordset
            let newData = []
            dataarr.forEach(item => {
                // console.log(item)
                if (item.username !== 'admin') {
                    newData.push({
                        UID: item.UID,
                        username: item.username,
                        password: "",
                        isAdmin: item.isAdmin,
                        station1: item.station1,
                        station2: item.station2,
                        station3: item.station3,
                        creatTime: getTime("YYYY-MM-DD HH:mm:ss", item.creatTime),
                        edit: false
                    })
                }
            });
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${req.session.login.username} 获取用户列表信息成功！`)
            writelogsql(1, `用户：${req.session.login.username} 获取用户列表信息成功！`)
            res.send({
                data: newData,
                code: 0,
                msg: "查询成功"
            });
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${req.session.login.username} 获取用户列表信息失败，服务器错误！${err}`)
            writelogsql(3, `用户：${req.session.login.username} 获取用户列表信息失败，服务器错误！${err}`)
            consolelog(3, `用户：${req.session.login.username} 获取用户列表信息失败！`)
            res.send({
                code: 4,
                msg: "查询失败"
            });
        })
});


//修改用户
router.post("/updateuser", (req, res) => {
    let loginuser = req.session.login.username
    // console.log(req.body)
    let uid = req.body.UID
    let username = req.body.username
    let password = req.body.password
    let isAdmin = req.body.isAdmin
    let station1 = req.body.station1
    let station2 = req.body.station2
    let station3 = req.body.station3
    if (uid === 0) {
        runSql(
            `SELECT * FROM dbo.t_user WHERE username = '${username}'`
        )
            .then(data => {
                if (data.rowsAffected[0] === 0) {
                    runSql(
                        "INSERT INTO dbo.t_user " +
                        `("username", "password", "isAdmin", "station1", "station2", "station3", "creatTime", "updateTime") ` +
                        "VALUES " +
                        `('${username}', '${crypto.createHash("sha256").update(password).digest("hex")}', '${isAdmin}', '${station1}', '${station2}', '${station3}', '${getTime("YYYY-MM-DD hh:mm:ss")}', '${getTime("YYYY-MM-DD hh:mm:ss")}')`
                    )
                        .then(data => {
                            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${loginuser} 创建新用户 ${username} 成功！`)
                            writelogsql(1, `用户：${loginuser} 创建新用户 ${username} 成功！`)
                            res.send({
                                code: 0,
                                msg: "增加用户成功"
                            });
                        })
                        .catch(err => {
                            // consolelog(3, `用户：${loginuser} 创建新用户 ${username} 失败，服务器错误！${err}`)
                            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${loginuser} 创建新用户 ${username} 失败，服务器错误！${err}`)
                            writelogsql(3, `用户：${loginuser} 创建新用户 ${username} 失败，服务器错误！${err}`)
                            consolelog(3, `用户：${loginuser} 创建新用户 ${username} 失败！`)
                            res.send({
                                code: 4,
                                msg: "增加用户失败"
                            });
                        })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${loginuser} 创建新用户 ${username} 失败，用户名 ${username} 已存在！`)
                    writelogsql(2, `用户：${loginuser} 创建新用户 ${username} 失败，用户名 ${username} 已存在！`)
                    consolelog(2, `用户：${loginuser} 创建新用户 ${username} 失败，用户名 ${username} 已存在！`)
                    res.send({
                        code: 2,
                        msg: "用户名已存在"
                    });
                }
            })
    } else {
        runSql(
            `UPDATE dbo.t_user ` +
            `SET "isAdmin" = '${isAdmin}', "station1" = '${station1}', "station2" = '${station2}', "station3" = '${station3}', "updateTime" = '${getTime("YYYY-MM-DD HH:mm:ss")}'` +
            `WHERE UID = ${uid}`
        )
            .then(data => {
                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${loginuser} 修改 ${username} 管理员权限为 ${isAdmin}！`)
                writelogsql(1, `用户：${loginuser} 修改 ${username} 管理员权限为 ${isAdmin}！`)
                res.send({
                    code: 0,
                    msg: "修改成功"
                });
            })
            .catch(err => {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${loginuser} 修改 ${username} 管理员权限失败，服务器错误！${err}`)
                writelogsql(3, `用户：${loginuser} 修改 ${username} 管理员权限失败，服务器错误！${err}`)
                consolelog(3, `用户：${loginuser} 修改 ${username} 管理员权限失败！`)
                res.send({
                    code: 4,
                    msg: "修改失败"
                });
            })
    }
});

//删除用户
router.post("/deleteuser", (req, res) => {
    let loginuser = req.session.login.username
    let uid = req.body.UID
    let username = req.body.username
    if (uid === 1) {
        writelog("./log/SystemLog/SystemLog.log", 2, `用户：${loginuser} 试图删除用户 ${username} 失败，此为系统默认账户，禁止删除！`)
        writelogsql(2, `用户：${loginuser} 试图删除用户 ${username} 失败，此为系统默认账户，禁止删除！`)
        consolelog(2, `用户：${loginuser} 试图删除用户 ${username} 失败，此为系统默认账户，禁止删除！`)
        res.send({
            code: 2,
            msg: "该用户禁止删除"
        });
    } else {
        runSql(
            `DELETE FROM dbo.t_user WHERE UID = ${uid}`
        )
            .then(data => {
                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${loginuser} 删除用户 ${username} 成功！`)
                writelogsql(1, `用户：${loginuser} 删除用户 ${username} 成功！`)
                res.send({
                    code: 0,
                    msg: "删除用户成功"
                });
            })
            .catch(err => {
                // console.log(err)
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${loginuser} 删除用户 ${username} 失败，服务器错误！${err}`)
                writelogsql(3, `用户：${loginuser} 删除用户 ${username} 失败，服务器错误！${err}`)
                consolelog(3, `用户：${loginuser} 删除用户 ${username} 失败！`)
                res.send({
                    code: 4,
                    msg: "删除用户失败"
                });
            })
    }
});

//获取库位Excel
router.get("/getLocationExcel", (req, res) => {
    let station1Sql = runSql(`SELECT * FROM dbo.t_SmallPartList WHERE Station = '工位1' ORDER BY LabelID`)
    let station1Sq2 = runSql(`SELECT * FROM dbo.t_SmallPartList WHERE Station = '工位2' ORDER BY LabelID`)
    let station1Sq3 = runSql(`SELECT * FROM dbo.t_SmallPartList WHERE Station = '工位3' ORDER BY LabelID`)
    let sqlArr = [station1Sql, station1Sq2, station1Sq3]
    Promise.all(sqlArr)
        .then(data => {
            if (data[0].rowsAffected[0] == 0 || data[1].rowsAffected[0] == 0 || data[2].rowsAffected[0] == 0) {
                res.send({
                    code: 1,
                    msg: "未查询到信息！"
                })
            } else {
                // res.send({
                //     code: 0,
                //     msg: "查询成功！",
                //     data: data.recordset
                // })
                let station1Data = data[0].recordset
                let station2Data = data[1].recordset
                let station3Data = data[2].recordset
                // console.log(station1Data)
                writelog("./log/SystemLog/SystemLog.log", 1, `读取库位数据成功！`)
                writelogsql(1, `读取库位数据成功！`)
                let templatepath = path.join(process.cwd(), '/template/Location Template.xlsx')
                let haveTemplate = fs.existsSync(templatepath); // 判断该文件是否存在
                if (!haveTemplate) {
                    writelog("./log/SystemLog/SystemLog.log", 3, "库位模板文件不存在！")
                    writelogsql(3, "库位模板文件不存在！")
                    consolelog(3, "库位模板文件不存在！")
                } else {
                    var workbook = new Excel.Workbook();
                    workbook.xlsx.readFile(templatepath)
                        .then(() => {
                            writelog("./log/SystemLog/SystemLog.log", 1, "导出模板读取成功！");
                            writelogsql(1, "导出模板读取成功！");
                            /* 获取sheet */
                            let worksheet1 = workbook.getWorksheet(`工位1`);
                            let worksheet2 = workbook.getWorksheet(`工位2`);
                            let worksheet3 = workbook.getWorksheet(`工位3`);
                            let allRoll = 146
                            // console.log(station1Data)
                            for (let line = 2; line < allRoll; line++) {
                                worksheet1.getCell(`B${line}`).value = station1Data[line - 2].PartNum
                                worksheet1.getCell(`C${line}`).value = station1Data[line - 2].PartName
                                worksheet1.getCell(`D${line}`).value = formatTime(station1Data[line - 2].Threshold_Time * 1)
                                worksheet2.getCell(`B${line}`).value = station2Data[line - 2].PartNum
                                worksheet2.getCell(`C${line}`).value = station2Data[line - 2].PartName
                                worksheet2.getCell(`D${line}`).value = formatTime(station2Data[line - 2].Threshold_Time * 1)
                                worksheet3.getCell(`B${line}`).value = station3Data[line - 2].PartNum
                                worksheet3.getCell(`C${line}`).value = station3Data[line - 2].PartName
                                worksheet3.getCell(`D${line}`).value = formatTime(station3Data[line - 2].Threshold_Time * 1)
                            }
                            let outpath = path.join(process.cwd(), '/template/output.xlsx')
                            workbook.xlsx.writeFile(outpath)
                                .then(() => {
                                    writelog("./log/SystemLog/SystemLog.log", 1, "库位表保存成功！");
                                    writelogsql(1, "库位表保存成功！");
                                    res.download(outpath, "output.xlsx");
                                })
                                .catch(err => {
                                    writelog("./log/SystemLog/SystemLog.log", 3, `库位表保存失败！${err}`);
                                    writelogsql(3, `库位表保存失败！${err}`);
                                    consolelog(3, `库位表保存失败！`);
                                    res.send({
                                        code: 1,
                                        msg: `库位表保存失败！【ERROR】${err}`
                                    })
                                })
                        })
                        .catch(err => {
                            writelog("./log/SystemLog/SystemLog.log", 3, `导出模板读取失败！${err}`);
                            writelogsql(3, `导出模板读取失败！${err}`);
                            consolelog(3, `导出模板读取失败！`);
                            res.send({
                                code: 1,
                                msg: `导出模板读取失败！【ERROR】${err}`
                            })
                        })
                }
            }
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `导出失败！${err}`);
            writelogsql(3, `库位表导出失败！${err}`);
            consolelog(3, `库位表导出失败！`);
            res.send({
                code: 4,
                msg: `查询失败！服务错误！${err}`
            })
        })
})


function formatTime(time) {
    // 3600000
    let s = Math.floor(time / 1000);
    let hour = Math.floor(s / 3600)
    let h = s % 3600
    let minute = Math.floor(h / 60)
    let second = h % 60
    let strTime = bl(hour) + ":" + bl(minute) + ":" + bl(second)
    return strTime
}

function bl(num) {
    return num < 10 ? "0" + num : "" + num
}



//上传库位模板
router.post("/uploadLocationFile", (req, res) => {
    // let username = req.body
    // console.log(req.body)
    // let username = "admin"
    upload(req, res, function (err) {
        let username = req.session.login.username
        // console.log(req.body)
        //发生错误
        if (err instanceof multer.MulterError) {
            consolelog(3, `用户：${username}  上传库位信息失败！`)
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 上传库位信息失败！${err}`)
            writelogsql(3, `用户：${username} 上传库位信息失败！${err}`)
            res.sendStatus(500);
        } else if (err) {
            consolelog(3, `用户：${username}  上传库位信息失败！`)
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 上传库位信息失败！${err}`)
            writelogsql(3, `用户：${username} 上传库位信息失败！${err}`)
            res.sendStatus(500);
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 上传库位信息成功！`)
            writelogsql(1, `用户：${username} 上传库位信息成功！`)
            runSql("truncate table dbo.t_SmallPartList")
                .then(result => {
                    writelog("./log/SystemLog/SystemLog.log", 1, `清空库位表成功！`)
                    writelogsql(1, `清空库位表成功！`)
                    let workbook = new Excel.Workbook();
                    workbook.xlsx.readFile(path.join(process.cwd(), `/uploadFile/${req.file.filename}`))
                        .then(data => {
                            writelog("./log/SystemLog/SystemLog.log", 1, `读取库位信息Excel文件成功！`)
                            writelogsql(1, `读取库位信息Excel文件成功！`)
                            let worksheet1 = workbook.getWorksheet(`工位1`);
                            let worksheet2 = workbook.getWorksheet(`工位2`);
                            let worksheet3 = workbook.getWorksheet(`工位3`);
                            let allRoll = 146

                            let sql = "INSERT INTO dbo.t_SmallPartList " +
                                `("Station", "LabelID", "PartNum", "PartName", "Threshold_Time") ` +
                                "VALUES ";
                            for (let j = 2; j < allRoll; j++) {
                                let LabelID = worksheet1.getCell(`A${j}`).text
                                let PartNum = worksheet1.getCell(`B${j}`).text
                                let PartName = worksheet1.getCell(`C${j}`).text
                                let time = time2second(worksheet1.getCell(`D${j}`).text)
                                sql += `('工位1', '${LabelID}', '${PartNum}', '${PartName}', '${time}'),`
                            }
                            for (let j = 2; j < allRoll; j++) {
                                let LabelID = worksheet2.getCell(`A${j}`).text
                                let PartNum = worksheet2.getCell(`B${j}`).text
                                let PartName = worksheet2.getCell(`C${j}`).text
                                let time = time2second(worksheet2.getCell(`D${j}`).text)
                                sql += `('工位2', '${LabelID}', '${PartNum}', '${PartName}', '${time}'),`
                            }
                            for (let j = 2; j < allRoll; j++) {
                                let LabelID = worksheet3.getCell(`A${j}`).text
                                let PartNum = worksheet3.getCell(`B${j}`).text
                                let PartName = worksheet3.getCell(`C${j}`).text
                                let time = time2second(worksheet3.getCell(`D${j}`).text)
                                sql += `('工位3', '${LabelID}', '${PartNum}', '${PartName}', '${time}'),`
                            }

                            sql = sql.substring(0, sql.length - 1)
                            if (sql === `INSERT INTO dbo.t_SmallPartList ("LabelID", "PartNum", "PartName") VALUES`) {
                                writelog("./log/SystemLog/SystemLog.log", 2, `上传模板为空！`)
                                writelogsql(2, `上传模板为空！`)
                                consolelog(2, `上传模板为空！`)
                                res.send({
                                    code: 2,
                                    msg: "上传模板为空！"
                                })
                            } else {
                                runSql(sql)
                                    .then(data => {
                                        // consolelog(1, data.rowsAffected[0])
                                        if (data.rowsAffected[0] * 1 == (allRoll - 2) * 3) {
                                            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 更新库位表成功！`)
                                            writelogsql(1, `用户：${username} 更新库位表成功！`)
                                            res.send({
                                                code: 0,
                                                msg: "库位表更新成功！"
                                            })
                                        } else {
                                            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 更新库位表失败，数量不正确！`)
                                            writelogsql(3, `用户：${username} 更新库位表失败，数量不正确！`)
                                            consolelog(3, `用户：${username} 更新库位表失败，数量不正确！`)
                                            res.send({
                                                code: 2,
                                                msg: "库位表更新失败，数量不正确！"
                                            })
                                        }
                                    })
                                    .catch(err => {
                                        writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 更新库位表失败！${err}`)
                                        writelogsql(3, `用户：${username} 更新库位表失败！${err}`)
                                        consolelog(3, `用户：${username} 更新库位表失败！`)
                                        res.send({
                                            code: 3,
                                            msg: `库位表更新失败！${err}`
                                        })
                                    })
                            }
                        })
                        .catch(err => {
                            writelog("./log/SystemLog/SystemLog.log", 3, `Excel文件读取失败！${err}`)
                            writelogsql(3, `Excel文件读取失败！${err}`)
                            consolelog(3, `Excel文件读取失败！`)
                            res.send({
                                code: 4,
                                msg: `库位表更新失败！${err}`
                            })
                        })
                })
                .catch(err => {
                    writelog("./log/SystemLog/SystemLog.log", 3, `库位表清空失败！${err}`)
                    writelogsql(3, `库位表清空失败！${err}`)
                    consolelog(3, `库位表清空失败！`)
                    res.send({
                        code: 5,
                        msg: `库位表清空失败！${err}`
                    })
                })
        }
    })
});

function time2second(time) {
    let timeArr = time.split(":")
    let hs = timeArr[0] * 3600
    let ms = timeArr[1] * 60
    let ss = timeArr[2] * 1
    return (hs + ms + ss) * 1000
}

//获取日志数量
router.post("/getLogCount", (req, res) => {
    let username = req.session.login.username
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    runSql(
        `SELECT COUNT(0) AS 'num' FROM dbo.t_log WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}'`
    )
        .then(data => {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询日志数量成功！`)
            writelogsql(1, `用户：${username} 查询日志数量成功！`)
            res.send({
                code: 0,
                msg: "查询成功！",
                num: data.recordset[0].num * 1
            })
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询日志数量失败！${err}`)
            writelogsql(3, `用户：${username} 查询日志数量失败！${err}`)
            consolelog(3, `用户：${username} 查询日志数量失败！`)
            res.send({
                code: 4,
                msg: "查询失败！" + err
            })
        })
})

//获取列表
router.post("/getLog", (req, res) => {
    let username = req.session.login.username
    let from = req.body.from
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    // SELECT TOP 50 * FROM tablename where id not in (  select top 6 id from tablename)
    runSql(
        `SELECT TOP 50 * FROM dbo.t_log WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}' AND id not in (SELECT TOP ${from} id FROM dbo.t_log WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}') ORDER BY id DESC`
    )
        .then(data => {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询日志成功！`)
            writelogsql(1, `用户：${username} 查询日志成功！`)
            let result = data.recordset
            res.send({
                data: result,
                code: 0,
                msg: "查询成功"
            });
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询日志失败！${err}`)
            writelogsql(3, `用户：${username} 查询日志失败！${err}`)
            consolelog(3, `用户：${username} 查询日志失败！`)
            res.send({
                code: 4,
                msg: "查询失败"
            });
        })
});

//获取日志数量
router.post("/getNetLogCount", (req, res) => {
    let username = req.session.login.username
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    runSql(
        `SELECT COUNT(0) AS 'num' FROM dbo.t_Netlog WHERE time BETWEEN '${fromDate}' AND '${toDate}'`
    )
        .then(data => {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询网络日志数量成功！`)
            writelogsql(1, `用户：${username} 查询网络日志数量成功！`)
            res.send({
                code: 0,
                msg: "查询成功！",
                num: data.recordset[0].num * 1
            })
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询网络日志数量失败！${err}`)
            writelogsql(3, `用户：${username} 查询网络日志数量失败！${err}`)
            consolelog(3, `用户：${username} 查询网络日志数量失败！`)
            res.send({
                code: 4,
                msg: "查询失败！" + err
            })
        })
})

//获取列表
router.post("/getNetLog", (req, res) => {
    let username = req.session.login.username
    let from = req.body.from
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    // SELECT TOP 50 * FROM tablename where id not in (  select top 6 id from tablename)
    runSql(
        `SELECT TOP 50 * FROM dbo.t_Netlog WHERE time BETWEEN '${fromDate}' AND '${toDate}' AND id not in (SELECT TOP ${from} id FROM dbo.t_Netlog WHERE time BETWEEN '${fromDate}' AND '${toDate}') ORDER BY id DESC`
    )
        .then(data => {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询网络日志成功！`)
            writelogsql(1, `用户：${username} 查询网络日志成功！`)
            let result = data.recordset
            res.send({
                data: result,
                code: 0,
                msg: "查询成功"
            });
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询网络日志失败！${err}`)
            writelogsql(3, `用户：${username} 查询网络日志失败！${err}`)
            consolelog(3, `用户：${username} 查询网络日志失败！`)
            res.send({
                code: 4,
                msg: "查询失败"
            });
        })
});

//获取任务数量
router.post("/getTaskCount", (req, res) => {
    let username = req.session.login.username
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    let station = req.body.station.replace("工位：", "")
    runSql(
        `SELECT COUNT(0) AS 'num' FROM dbo.t_PickListStation${station} WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}'`
    )
        .then(data => {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询任务数量成功！`)
            writelogsql(1, `用户：${username} 查询任务数量成功！`)
            res.send({
                code: 0,
                msg: "查询成功！",
                num: data.recordset[0].num * 1
            })
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询任务数量失败！${err}`)
            writelogsql(3, `用户：${username} 查询任务数量失败！${err}`)
            consolelog(3, `用户：${username} 查询任务数量失败！`)
            res.send({
                code: 4,
                msg: "查询失败！" + err
            })
        })
})

//获取列表
router.post("/getTask", (req, res) => {
    // console.log(req)
    let username = req.session.login.username
    let from = req.body.from
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    // consolelog(2, req.body.station)
    let station = req.body.station.replace("工位：", "")
    // consolelog(2, station)
    // SELECT TOP 50 * FROM tablename where id not in (  select top 6 id from tablename)
    runSql(
        `SELECT TOP 50 * FROM dbo.t_PickListStation${station} WHERE fileTime BETWEEN '${fromDate}' AND '${toDate}' AND id not in (SELECT TOP ${from} id FROM dbo.t_PickListStation${station} WHERE fileTime BETWEEN '${fromDate}' AND '${toDate}')  ORDER BY PlanCurSeq`
    )
        .then(data => {
            writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询任务列表成功！`)
            writelogsql(1, `用户：${username} 查询任务列表成功！`)
            let result = data.recordset
            result.forEach(item => {
                item.Part_blgroup === driver ? item.Part_blgroup = "主司机" :
                    item.Part_blgroup === codriver ? item.Part_blgroup = "副司机" :
                        item.Part_blgroup === backseat ? item.Part_blgroup = "后座" :
                            item.Part_blgroup === leanback ? item.Part_blgroup = "后靠" : "未知"
            })
            res.send({
                data: result,
                code: 0,
                msg: "查询成功"
            });
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询任务列表失败！${err}`)
            writelogsql(3, `用户：${username} 查询任务列表失败！${err}`)
            consolelog(3, `用户：${username} 查询任务列表失败！`)
            res.send({
                code: 4,
                msg: "查询失败"
            });
        })
});

//获取列表
router.post("/getPnName", (req, res) => {
    // let json = {}; json[key] = value
    let sql = `SELECT "PartNum", "PartName" FROM dbo.t_SmallPartList WHERE LabelID LIKE '0[1-9][1-4][1-4]'`
    runSql(sql)
        .then(data => {
            if (data) {
                writelog("./log/SystemLog/SystemLog.log", 1, `获取零件名列表成功！`)
                writelogsql(1, `获取零件名列表成功！`)
                // console.log(data.recordset)
                let uniqueData = SunArray.unique(data.recordset, "PartNum")
                let json = {};
                uniqueData.forEach(item => {
                    json[item.PartNum] = item.PartName
                })
                // console.log(json)
                res.send({
                    code: 0,
                    msg: "查询成功",
                    data: json
                })
            } else {
                writelog("./log/SystemLog/SystemLog.log", 3, `获取零件名列表失败，未知错误！`)
                writelogsql(3, `获取零件名列表失败，未知错误！`)
                consolelog(3, `获取零件名列表失败，未知错误！`)
                res.send({
                    code: 2,
                    msg: "查询失败，未知错误！"
                })
            }
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `获取零件名列表失败，${err}`)
            writelogsql(3, `获取零件名列表失败，${err}`)
            consolelog(3, `获取零件名列表失败！`)
            res.send({
                code: 4,
                msg: "查询失败，" + err,
            })
        })
})

//获取日志数量
router.post("/getReprintListCount", (req, res) => {
    let username = req.session.login.username
    let datrArr = req.body.dateArr
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    let station = req.body.station.replace("工位：", "")
    runSql(`SELECT COUNT(0) AS 'num' FROM dbo.t_reprintListStation${station} WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}'`)
        .then(data => {
            if (data) {
                let num = (data.recordset[0].num * 1)
                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询补打任务数量成功！`)
                writelogsql(1, `用户：${username} 查询补打任务数量成功！`)
                res.send({
                    code: 0,
                    msg: "查询成功！",
                    num: num
                })
            } else {
                writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询补打任务数量失败，未知错误！`)
                writelogsql(3, `用户：${username} 查询补打任务数量失败，未知错误！`)
                consolelog(3, `用户：${username} 查询补打任务数量失败，未知错误！`)
                res.send({
                    code: 4,
                    msg: "查询失败，未知错误！"
                })
            }
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询补打任务数量失败！${err}`)
            writelogsql(3, `用户：${username} 查询补打任务数量失败！${err}`)
            consolelog(3, `用户：${username} 查询补打任务数量失败！`)
            res.send({
                code: 4,
                msg: "查询失败！" + err
            })
        })
})

//获取列表
router.post("/getReprintList", (req, res) => {
    let username = req.session.login.username
    let datrArr = req.body.dateArr
    let from = req.body.from
    let fromDate = getTime("YYYY-MM-DD ", datrArr[0]) + "00:00:00.000"
    let toDate = getTime("YYYY-MM-DD ", datrArr[1]) + "23:59:59.000"
    let station = req.body.station.replace("工位：", "")
    runSql(`SELECT TOP 50 * FROM dbo.t_reprintListStation${station} WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}' AND id not in (SELECT TOP ${from} id FROM dbo.t_reprintListStation${station} WHERE creatTime BETWEEN '${fromDate}' AND '${toDate}') ORDER BY id DESC`)
        .then(data => {
            if (data) {
                writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 查询任务数量成功！`)
                writelogsql(1, `用户：${username} 查询任务数量成功！`)
                res.send({
                    code: 0,
                    msg: "查询成功！",
                    data: data.recordset
                })
            }
        })
        .catch(err => {
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 查询任务数量失败！${err}`)
            writelogsql(3, `用户：${username} 查询任务数量失败！${err}`)
            consolelog(3, `用户：${username} 查询任务数量失败！`)
            res.send({
                code: 4,
                msg: "查询失败！" + err
            })
        })
});



module.exports = router;