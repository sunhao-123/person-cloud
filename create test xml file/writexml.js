var xml2js = require('xml2js');
var fs = require('fs');
var getTime = require('./gettime');

for (let i = 0; i < 1000; i++) {
    let xmljson = {
        Broadcast: {
            '$': { TimeStamp: getTime("YYYYMMDDHHmmssSSS"), ID: 140884 + i + 1 + "" },
            Order: [
                {
                    '$': {
                        PlanCurSeq: (442665 + i + 1) + "",
                        PlanPreSeq: (442665 + i) + "",
                        Plant: '88',
                        CarSet: 'L210225-15',
                        Family: 'G2X',
                        VIN: 'M359200',
                        number: (65526411 + i + 1) + ""
                    },
                    Part: [
                        { '$': { blgroup: 'SITKKVL1', LearId: '7433525-06', Qty: '1' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '7469671-08', Qty: '1' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '7469679-06', Qty: '1' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '7492933-10', Qty: '1' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '9108107-02', Qty: '1' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '9390113-02', Qty: '2' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '7441493-09', Qty: '2' } },
                        { '$': { blgroup: 'SITKKVL1', LearId: '5A1EAD5-01', Qty: '1' } }
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