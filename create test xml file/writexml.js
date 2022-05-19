var xml2js = require('xml2js');
var fs = require('fs');
var getTime = require('./gettime');

let family = ["G08", "G2X"]
let product = ["SITKKVL1", "SITKKVR1", "SITKKN2", "SITKKH1"]

for (let i = 0; i < 300; i++) {
    let blgroup = product[getRandomInt(0, 3)]
    let xmljson = {
        Broadcast: {
            '$': { TimeStamp: getTime("YYYYMMDDHHmmssSSS"), ID: 340884 + i + 1 + "" },
            Order: [
                {
                    '$': {
                        PlanCurSeq: (842665 + i + 1) + "",
                        PlanPreSeq: (842665 + i) + "",
                        Plant: '88',
                        CarSet: 'L210225-15',
                        Family: family[getRandomInt(0, 1)],
                        VIN: 'M359200',
                        number: (65726411 + i + 1) + ""
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

    console.log(xml)

    fs.writeFileSync(`./xmlxml/JX${getTime("YYYYMMDDHHmmssSSS")}.xml`, xml, { flag: "a" }, (error) => {
        if (!error) return;
        console.log("写入出错", error);
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}