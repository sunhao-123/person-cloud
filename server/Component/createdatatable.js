const getTime = require('./gettime');
const writelog = require('./writelog')
const consolelog = require('./consolelog')
const runSql = require('../db/datebase');
const crypto = require("crypto");

//t_user表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_user')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_user" +
                "(" +
                "UID              int             not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                'username         nvarchar(20)    not null,' +
                'password         nvarchar(1023)  not null,' +
                'isAdmin          bit             not null,' +
                'station1         bit             not null,' +
                'station2         bit             not null,' +
                'station3         bit             not null,' +
                "creatTime        datetime        not null," +
                "updateTime       datetime            null," +
                ")"
            ).then(() => {
                writelog("./log/SystemLog/SystemLog.log", 1, "t_user 数据表创建成功！")
                runSql(
                    "INSERT INTO dbo.t_user " +
                    `("username", "password", "isAdmin", "station1", "station2", "station3", "creatTime", "updateTime") ` +
                    "VALUES " +
                    `('admin', '${crypto.createHash("sha256").update('Admin123456').digest("hex")}', '${true}', '${true}', '${true}', '${true}', '${getTime("YYYY-MM-DD hh:mm:ss")}', ${null})`
                )
                    .then(data => {
                        writelog("./log/SystemLog/SystemLog.log", 1, "基础管理员账号创建成功！")
                    })
                    .catch(err => {
                        consolelog(3, `基础管理员账号创建失败！`)
                        writelog("./log/SystemLog/SystemLog.log", 3, `基础管理员账号创建失败！${err}`)
                    })
            })
                .catch(err => {
                    consolelog(3, `t_user 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_user 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_user 表已存在！`)
        }
    })

//t_PickListStation1
runSql("select count(*) from sysobjects where id = object_id('dbo.t_PickListStation1')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_PickListStation1" +
                "(" +
                "ID            int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "XID           nvarchar(20)      not null," +
                "orderNum      nvarchar(20)      not null," +
                "PlanCurSeq    nvarchar(20)      not null," +
                "PlanPreSeq    nvarchar(20)      not null," +
                "Plant         nvarchar(5)       not null," +
                "CarSet        nvarchar(20)      not null," +
                "Family        nvarchar(20)      not null," +
                "Part_blgroup  nvarchar(20)      not null," +
                "Part_LearId   nvarchar(511)     not null," +
                "Part_Qty      nvarchar(30)      not null," +
                "VIN           nvarchar(20)      not null," +
                "fileTime      datetime          not null," +
                "creatTime     datetime          not null," +
                "isFinish      bit               not null," +
                "updateTime    datetime              null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_PickListStation1 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_PickListStation1 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_PickListStation1 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_PickListStation1 表已存在！`)
        }
    })

//t_PickListStation2
runSql("select count(*) from sysobjects where id = object_id('dbo.t_PickListStation2')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_PickListStation2" +
                "(" +
                "ID            int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "XID           nvarchar(20)      not null," +
                "orderNum      nvarchar(20)      not null," +
                "PlanCurSeq    nvarchar(20)      not null," +
                "PlanPreSeq    nvarchar(20)      not null," +
                "Plant         nvarchar(5)       not null," +
                "CarSet        nvarchar(20)      not null," +
                "Family        nvarchar(20)      not null," +
                "Part_blgroup  nvarchar(20)      not null," +
                "Part_LearId   nvarchar(511)     not null," +
                "Part_Qty      nvarchar(30)      not null," +
                "VIN           nvarchar(20)      not null," +
                "fileTime      datetime          not null," +
                "creatTime     datetime          not null," +
                "isFinish      bit               not null," +
                "updateTime    datetime              null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_PickListStation2 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_PickListStation2 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_PickListStation2 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_PickListStation2 表已存在！`)
        }
    })

//t_PickListStation3
runSql("select count(*) from sysobjects where id = object_id('dbo.t_PickListStation3')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_PickListStation3" +
                "(" +
                "ID            int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "XID           nvarchar(20)      not null," +
                "orderNum      nvarchar(20)      not null," +
                "PlanCurSeq    nvarchar(20)      not null," +
                "PlanPreSeq    nvarchar(20)      not null," +
                "Plant         nvarchar(5)       not null," +
                "CarSet        nvarchar(20)      not null," +
                "Family        nvarchar(20)      not null," +
                "Part_blgroup  nvarchar(20)      not null," +
                "Part_LearId   nvarchar(511)     not null," +
                "Part_Qty      nvarchar(30)      not null," +
                "VIN           nvarchar(20)      not null," +
                "fileTime      datetime          not null," +
                "creatTime     datetime          not null," +
                "isFinish      bit               not null," +
                "updateTime    datetime              null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_PickListStation3 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_PickListStation3 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_PickListStation3 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_PickListStation3 表已存在！`)
        }
    })

//t_reprintListStation1表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_reprintListStation1')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_reprintListStation1" +
                "(" +
                "ID            int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "orderNum      nvarchar(255)     not null," +
                "creatTime     datetime          not null," +
                "needRestart   bit               not null," +
                "isFinish      bit               not null," +
                "updateTime    datetime              null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_reprintListStation1 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_reprintListStation1 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_reprintListStation1 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_reprintListStation1 表已存在！`)
        }
    })

//t_reprintListStation2表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_reprintListStation2')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_reprintListStation2" +
                "(" +
                "ID            int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "orderNum      nvarchar(255)     not null," +
                "creatTime     datetime          not null," +
                "needRestart   bit               not null," +
                "isFinish      bit               not null," +
                "updateTime    datetime              null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_reprintListStation2 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_reprintListStation2 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_reprintListStation2 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_reprintListStation2 表已存在！`)
        }
    })

//t_reprintListStation3表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_reprintListStation3')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_reprintListStation3" +
                "(" +
                "ID            int               not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                "orderNum      nvarchar(255)     not null," +
                "creatTime     datetime          not null," +
                "needRestart   bit               not null," +
                "isFinish      bit               not null," +
                "updateTime    datetime              null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_reprintListStation3 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_reprintListStation3 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_reprintListStation3 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_reprintListStation3 表已存在！`)
        }
    })

//t_log表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_log')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_log" +
                "(" +
                "ID               int             not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                '"cont"           nvarchar(255)   not null,' +
                "creatTime        datetime            null," +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_log数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_log 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_log 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_log 表已存在！`)
        }
    })

//t_SmallPartList表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_SmallPartList')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_SmallPartList" +
                "(" +
                "ID               int             not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                'PartNum          nvarchar(20)        null,' +
                'PartName         nvarchar(50)        null,' +
                'Station          nvarchar(20)    not null,' +
                'LabelID          nvarchar(50)    not null,' +
                'Threshold_Time   int                 null,' +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_SmallPartList 数据表创建成功！")
                    let sql = "INSERT INTO dbo.t_SmallPartList " +
                        `("Station", "LabelID", "Threshold_Time") ` +
                        "VALUES "
                    for (let num = 1; num < 4; num++) {
                        for (let i = 1; i < 10; i++) {
                            for (let j = 1; j < 5; j++) {
                                for (let k = 1; k < 5; k++) {
                                    sql += `('工位${num}', '0${i}${j}${k}', ${0}),`
                                }
                            }
                        }
                    }
                    sql = sql.substring(0, sql.length - 1)
                    // console.log(sql)
                    runSql(sql)
                        .then(data => {
                            writelog("./log/SystemLog/SystemLog.log", 1, "标签ID基础数据创建成功！")
                        })
                        .catch(err => {
                            consolelog(3, `标签ID基础数据创建失败！`)
                            writelog("./log/SystemLog/SystemLog.log", 3, `标签ID基础数据创建失败！${err}`)
                        })
                })
                .catch(err => {
                    consolelog(3, `t_SmallPartList 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_SmallPartList 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_SmallPartList 表已存在！`)
        }
    })

//t_Netlog表
runSql("select count(*) from sysobjects where id = object_id('dbo.t_Netlog')")
    .then(data => {
        let havedb = data.recordset[0][''] === 0 ? false : true
        if (!havedb) {
            runSql(
                "create table dbo.t_Netlog" +
                "(" +
                "ID             int             not null    identity(1,1)    primary key," +//设置为主键和自增长列，起始值为1，每次自增1
                'time           datetime        not null,' +
                'method         nvarchar(20)    not null,' +
                'httpVersion    nvarchar(20)    not null,' +
                'url            nvarchar(255)   not null,' +
                'data           nvarchar(4000)  not null,' +
                'clientIP       nvarchar(20)    not null,' +
                'clientUa       nvarchar(32)    not null,' +
                'clientSystem   nvarchar(20)    not null,' +
                ")"
            )
                .then(() => {
                    writelog("./log/SystemLog/SystemLog.log", 1, "t_Netlog 数据表创建成功！")
                })
                .catch(err => {
                    consolelog(3, `t_Netlog 数据表创建失败！`)
                    writelog("./log/SystemLog/SystemLog.log", 3, `t_Netlog 数据表创建失败！${err}`)
                })
        } else {
            writelog("./log/SystemLog/SystemLog.log", 1, `t_Netlog 表已存在！`)
        }
    })