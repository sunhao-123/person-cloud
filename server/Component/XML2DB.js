const consolelog = require('./consolelog');
const writelog = require('./writelog');
const getTime = require('./gettime');
const runSql = require('../db/datebase');

const XML2DB = (object) => {
    let data = JSON.parse(JSON.stringify(object))
    // console.log(data)
    let station = data.Family === "G2X" ? 1 : 2
    // XID
    // orderNum
    // PlanCurSeq
    // PlanPreSeq
    // Plant
    // CarSet
    // Family
    // Part
    // VIN
    // creatTime
    // isFinish

    // TimeStamp: 20220413101820788,
    // ID: 140884,
    // PlanCurSeq: 442665,
    // PlanPreSeq: 442664,
    // Plant: 88,
    // CarSet: 'L210225-15',
    // Family: 'G2X',
    // VIN: 'M359200',
    // number: 65526411,
    // Part: [
    let selectsql = `SELECT COUNT(*) FROM dbo.t_PickListStation${station} WHERE orderNum = '${data.number}'`
    runSql(selectsql)
        .then(sqlresult => {
            if (sqlresult.recordset[0][''] * 1 == 0) {
                let insertsql = `INSERT INTO dbo.t_PickListStation${station} ("XID", "orderNum", "PlanCurSeq", "PlanPreSeq", "Plant", "CarSet", "Family", "VIN", "Part_blgroup", "Part_LearId", "Part_Qty", "fileTime", "creatTime", "isFinish") ` +
                    `VALUES ('${data.ID}', '${data.number}', '${data.PlanCurSeq}', '${data.PlanPreSeq}', '${data.Plant}', '${data.CarSet}', '${data.Family}', '${data.VIN}', ${getPart(data.Part)}'${formatTimeStamp(data.TimeStamp)}', '${getTime("YYYY-MM-DD HH:mm:ss.SSS")}', '${false}')`

                    // console.log(insertsql)
                runSql(insertsql)
                    .then(sqlresult1 => {
                        if (sqlresult1.rowsAffected[0] >= 1) {
                            writelog("./log/SystemLog/SystemLog.log", 1, `${data.number} 数据解析完成并写入数据库！`)
                        } else {
                            writelog("./log/SystemLog/SystemLog.log", 3, `${data.number} 数据解析完成但写入数据库失败，写入数据量为0！`)
                            consolelog(3, `${data.number} 数据解析完成但写入数据库失败，写入数据量为0！`)
                        }
                    })
            } else {
                writelog("./log/SystemLog/SystemLog.log", 2, `${data.number} 数据解析完成但数据已存在！`)
                consolelog(2, `${data.number} 数据解析完成但数据已存在！`)
            }
        })
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
    let blgroup = ""
    let LearIds = []
    let Qtys = []
    part.forEach(item => {
        blgroup = item.blgroup
        LearIds.push(item.LearId)
        Qtys.push(item.Qty)
    });

    sqlString += `\'${blgroup}\', \'${LearIds.join(",")}\', \'${Qtys.join(",")}\', `
    return sqlString
}

module.exports = XML2DB