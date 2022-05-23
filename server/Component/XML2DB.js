const fs = require('fs-extra');
const path = require('path');
const ws = require("nodejs-websocket")
const consolelog = require('./consolelog');
const writelog = require('./writelog');
const writelogsql = require('./writelogsql');
const getTime = require('./gettime');
const runSql = require('../db/datebase');
const websocketConf = require('./webSocket');

let config
let haveRedisConfig = fs.existsSync(path.join(process.cwd(), '/config/Server_config.json'))
if (haveRedisConfig) {
    config = require(path.join(process.cwd(), '/config/Server_config.json'))
    writelog("./log/SystemLog/SystemLog.log", 1, `Server_config 配置文件读取成功！`)
} else {
    consolelog(3, "服务配置文件丢失，请联系供应商解决!")
    writelog("./log/SystemLog/SystemLog.log", 3, `服务配置文件丢失，请联系供应商解决！`)
}

let websocket= websocketConf()
let wsserver = websocket.wsserver
let stationKey = websocket.stationKey

const driver = config["Driver"];
const codriver = config["Co-driver"]
const backseat = config["backseat"]
const leanback = config["Lean-back"]
const station1 = config["station1"]
const station2 = config["station2"]
const station3 = config["station3"]

let station1Arr = formatStation(station1)
let station2Arr = formatStation(station2)
let station3Arr = formatStation(station3)

const XML2DB = (object) => {
    let data = JSON.parse(JSON.stringify(object))
    // console.log(data)
    // let station = data.blgroup === driver ? 1 : 2
    let name = data.blgroup === driver ? "主" : data.blgroup === codriver ? "副" : data.blgroup === backseat ? "座" : data.blgroup === leanback ? "靠" : "未知"
    let stationname = data.Family + name
    let station = 0
    if (station1Arr.includes(stationname)) {
        station = 1
    } else if (station2Arr.includes(stationname)) {
        station = 2
    } else if (station3Arr.includes(stationname)) {
        station = 3
    } else {
        consolelog(3, "识别到未知产线配置信息！")
        writelog("./log/SystemLog/SystemLog.log", 3, "识别到未知产线配置信息！")
    }
    if (station !== 0) {
        let selectsql = `SELECT COUNT(*) FROM dbo.t_PickListStation${station} WHERE orderNum = '${data.number}'`
        runSql(selectsql)
            .then(sqlresult => {
                let createDateTime = getTime("YYYY-MM-DD HH:mm:ss.SSS")
                if (sqlresult.recordset[0][''] * 1 == 0) {
                    let insertsql = `INSERT INTO dbo.t_PickListStation${station} ("XID", "orderNum", "PlanCurSeq", "PlanPreSeq", "Plant", "CarSet", "Family", "VIN", "Part_blgroup", "Part_LearId", "Part_Qty", "fileTime", "creatTime", "isFinish") ` +
                        `VALUES ('${data.ID}', '${data.number}', '${data.PlanCurSeq}', '${data.PlanPreSeq}', '${data.Plant}', '${data.CarSet}', '${data.Family}', '${data.VIN}', '${data.blgroup}', ${getPart(data.Part)}'${formatTimeStamp(data.TimeStamp)}', '${createDateTime}', '${false}')`

                    // console.log(insertsql)
                    runSql(insertsql)
                        .then(sqlresult1 => {
                            if (sqlresult1.rowsAffected[0] >= 1) {
                                writelog("./log/SystemLog/SystemLog.log", 1, `${data.number} 数据解析完成并写入数据库！`)
                                for (let i = 0; i < 3; i++) {
                                    let conn = wsserver.connections[i]
                                    if (conn) {
                                        if (conn.key === stationKey["station" + station]) {
                                            conn.sendText("工位" + station + "数据更新：" + createDateTime)
                                            writelog("./log/SystemLog/SystemLog.log", 1, "工位" + station + "数据更新：" + createDateTime)
                                            break;
                                        }
                                    }
                                }
                            } else {
                                writelog("./log/SystemLog/SystemLog.log", 3, `${data.number} 数据解析完成但写入数据库失败，写入数据量为0！`)
                                consolelog(3, `${data.number} 数据解析完成但写入数据库失败，写入数据量为0！`)
                            }
                        })
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `${data.number} 数据解析完成但数据已存在！`)
                    consolelog(2, `${data.number} 数据解析完成但数据已存在！`)
                    // for (let i = 0; i < 3; i++) {
                    //     let conn = wsserver.connections[i]
                    //     if (conn) {
                    //         if (conn.key === stationKey["station" + station]) {
                    //             conn.sendText("工位" + station + "数据更新：" + createDateTime)
                    //             break;
                    //         }
                    //     }
                    // }
                }
            })
    }
}

function formatTimeStamp(asrsTime) {
    // 20220413101820788
    // YYYY-MM-DD HH:mm:ss.SSS
    let timeStamp = asrsTime + ""
    let yYYY = timeStamp.substring(0, 4)
    let mM = timeStamp.substring(4, 6)
    let dD = timeStamp.substring(6, 8)
    let hH = timeStamp.substring(8, 10)
    let mm = timeStamp.substring(10, 12)
    let ss = timeStamp.substring(12, 14)
    let sSS = timeStamp.substring(14, 17)
    return `${yYYY}-${mM}-${dD} ${hH}:${mm}:${ss}.${sSS}`
}

function getPart(part) {
    // "Part_blgroup", "Part_LearId", "Part_Qty"
    let sqlString = ""
    let LearIds = []
    let Qtys = []
    part.forEach(item => {
        LearIds.push(item.LearId)
        Qtys.push(item.Qty)
    });

    sqlString += `\'${LearIds.join(",")}\', \'${Qtys.join(",")}\', `
    return sqlString
}

function formatStation(stationStr) {
    let stationArr = stationStr.split("-")
    let family = stationArr[0]
    let productArr = stationArr[1].split("+")
    let arr = []
    productArr.forEach(item => {
        arr.push(family + item)
    })
    return arr
}

module.exports = XML2DB