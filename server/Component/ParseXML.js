const fs = require('fs-extra');
var xml2js = require('xml2js');
const consolelog = require('./consolelog');
const writelog = require('./writelog');
const XML2DB = require('./XML2DB');
const path = require("path")

var parser = new xml2js.Parser();
const ParseXML = (filePath) => {
    // console.time(filePath)
    fs.readFile(filePath, function (err, data) {
        parser.parseString(data, function (err, result) {
            let data = result.Broadcast
            let obj = {
                TimeStamp: data.$.TimeStamp * 1,
                ID: data.$.ID * 1,
                PlanCurSeq: data.Order[0].$.PlanCurSeq * 1,
                PlanPreSeq: data.Order[0].$.PlanPreSeq * 1,
                Plant: data.Order[0].$.Plant * 1,
                CarSet: data.Order[0].$.CarSet,
                Family: data.Order[0].$.Family,
                blgroup: data.Order[0].Part[0].$.blgroup,
                VIN: data.Order[0].$.VIN,
                number: data.Order[0].$.number * 1,
                Part: []
            }
            data.Order[0].Part.forEach(item => {
                obj.Part.push({
                    LearId: item.$.LearId,
                    Qty: item.$.Qty * 1
                })
            });
            // console.log("Broadcast.TimeStamp: " + data.$.TimeStamp * 1)
            // console.log("Broadcast.ID: " + data.$.ID)
            // console.log("Order.PlanCurSeq: " + data.Order[0].$.PlanCurSeq * 1)
            // console.log("Order.PlanPreSeq: " + data.Order[0].$.PlanPreSeq * 1)
            // console.log("Order.Plant: " + data.Order[0].$.Plant * 1)
            // console.log("Order.CarSet: " + data.Order[0].$.CarSet)
            // console.log("Order.Family: " + data.Order[0].$.Family)
            // console.log("Order.VIN: " + data.Order[0].$.VIN)
            // console.log("Order.number: " + data.Order[0].$.number * 1)
            // console.log("Part: ")
            // console.log(Part)

            XML2DB(obj)
            // let filename = path.basename(filePath)
            // consolelog(1, `${filename} 解析完成！`)
            writelog("./log/SystemLog/SystemLog.log", 1, `文件 ${filePath} 解析完成！`)
            // console.timeEnd(filePath)
        });
    });
}

module.exports = ParseXML