var xml2js = require('xml2js');
var fs = require('fs');
var getTime = require('./gettime');

let family = ["G08", "G2X"]
let product = ["SITKKVL1", "SITKKVR1", "SITKKN2", "SITKKH1"]

var options = process.argv;
// console.log(options)
let allNum = 0;
let ID = 0;
let seq = 0;
let vin = 0;
let num = 0;
for (var i = 0; i < options.length; i++) {
    if (options[i] == "-a") {
        allNum = options[i + 1] * 1;
    }
    if (options[i] == "-i") {
        ID = options[i + 1] * 1;
    }
    if (options[i] == "-s") {
        seq = options[i + 1] * 1;
    }
    if (options[i] == "-v") {
        vin = options[i + 1] * 1;
    }
    if (options[i] == "-n") {
        num = options[i + 1] * 1;
    }
}

if (allNum && ID && seq && vin && num) {
    for (let i = 0; i < allNum; i++) {
        let blgroup = product[getRandomInt(0, 3)]
        let xmljson = {
            Broadcast: {
                '$': { TimeStamp: getTime("YYYYMMDDHHmmssSSS"), ID: ID + i + 1 + "" },
                Order: [
                    {
                        '$': {
                            PlanCurSeq: (seq + (i + 1)) + "",
                            PlanPreSeq: (seq + i) + "",
                            Plant: '88',
                            CarSet: 'L210225-15',
                            Family: family[getRandomInt(0, 1)],
                            VIN: 'M' + (vin + 1),
                            number: (num + i + 1) + ""
                        },
                        Part: [
                            { '$': { blgroup: blgroup, LearId: '7433525-06', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '7469671-08', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '7469679-06', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '7492933-10', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '9108107-02', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '9390113-02', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '7441493-09', Qty: getRandomInt(1, 3) } },
                            { '$': { blgroup: blgroup, LearId: '5A1EAD5-01', Qty: getRandomInt(1, 3) } }
                        ]
                    }
                ]
            }
        }

        var builder = new xml2js.Builder();
        var xml = builder.buildObject(xmljson);

        console.log("第 " + (i + 1) + " 个已生成");

        fs.writeFileSync(`./xmlxml/JX${getTime("YYYYMMDDHHmmssSSS")}.xml`, xml, { flag: "a" }, (error) => {
            if (!error) return;
            console.log("写入出错", error);
        });
    }
} else {
    console.log("参数不全")
    console.log("-a 总数 -i ID开始序号 -s seq开始序号 -v vin开始序号 -n number开始序号")
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}