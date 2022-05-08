var xml2js = require('xml2js');
var fs = require('fs');

var parser = new xml2js.Parser();

let path = "./Sample.xml"

fs.readFile(path, function (err, data) {
    parser.parseString(data, function (err, result) {
        console.log(result.Broadcast.Order[0].Part)
    });
});