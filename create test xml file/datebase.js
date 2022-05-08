var sql = require('mssql');
var fs = require("fs");
var path = require("path");

function connectSQL() {
    sql.connect({
        "user": "pickingtest",
        "password": "sunhao123",
        "server": "127.0.0.1",
        "port": 1433,
        "database": "CFAAPicking",
        "pool": {
            "max": 10,
            "min": 0,
            "idleTimeoutMillis": 9999999999
        },
        "options": {
            "encrypt": false,
            "enableArithAbort": true
        }
    })
        .then(() => {
            console.log("cg")
        })
        .catch(err => {
            console.log(err)
            setTimeout(function () { connectSQL() }, 5000)
        })
}
connectSQL()

sql.on('error', err => {
    console.log(err)
    connectSQL()
})

function runSql(sqltext) {
    return new Promise((resolve, reject) => {
        sql.query(sqltext, (err, recordset) => {
            if (err) {
                reject(err)
            } else {
                resolve(recordset)
            }
        });
    })
}

module.exports = runSql