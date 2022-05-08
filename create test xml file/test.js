var xml2js = require('xml2js');
var fs = require('fs');
const runSql = require('./datebase');
const getTime = require('./gettime');

setTimeout(start, 1000)

function start() {
    let sql = `SELECT "Big_PN" FROM dbo.t_PartNum_info`
    runSql(sql)
        .then(data => {
            let arr = []
            for (let i = 0; i < data.recordsets[0].length; i++) {
                arr.push(data.recordsets[0][i].Big_PN)
            }
            let data1 = deduplication(arr)
            // console.log(data1)
            data1.forEach(item => {
                let sql1 = `SELECT * FROM dbo.t_PartNum_info WHERE ([Big_PN] = '${item}')`
                runSql(sql1)
                    .then(data2 => {
                        let xmldata = data2.recordsets[0]
                        let xmljson = {
                            PBLData: {
                                '$': {
                                    type: 'create',
                                    created: getTime("YYYY-MM-DD HH:mm:ss.SSS")
                                },
                                order: [{
                                    '$': {
                                        orderNum: ""
                                    }
                                }],
                                station: [{
                                    '$': {
                                        stationName: "工位1"
                                    }
                                }],
                                boms: [{
                                    '$': {
                                        name: ""
                                    },
                                    bom: []
                                }]
                            }
                        }
                        xmldata.forEach(item1 => {
                            // console.log(item1)
                            xmljson.PBLData.order[0].$.orderNum = item1.Big_PN
                            xmljson.PBLData.boms[0].$.name = item1.Big_PartName
                            xmljson.PBLData.boms[0].bom.push({ '$': { pn: item1.Small_PN } })
                        })
                        var builder = new xml2js.Builder();
                        var xml = builder.buildObject(xmljson);
                        // console.log(xml)
                        fs.writeFileSync(`./xmlfile/${item}.xml`, xml, { flag: "a" }, (error) => {
                            if (!error) return;
                            console.log("写入出错", error);
                        });
                    })
            })
        })
        .catch(err => {
            console.log(err)
        })
}

function deduplication(array) {
    const result = []
    const tagObj = {}
    for (const i of array) {
        if (!tagObj[i]) {
            result.push(i)
            tagObj[i] = 1
        }
    }
    return result
}

// fs.writeFileSync("./xmlxml/xml.xml", xml, { flag: "a" }, (error) => {
//     if (!error) return;
//     console.log("写入出错", error);
// });