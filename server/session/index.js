var session = require('express-session');
var RedisStore = require('connect-redis')(session);
const redis = require('redis')
var path = require("path");
var fs = require("fs");
const writelog = require('../Component/writelog');
const consolelog = require('../Component/consolelog');

let config
let haveRedisConfig = fs.existsSync(path.join(process.cwd(), '/config/redis_config.json'))
if (haveRedisConfig) {
    config = require(path.join(process.cwd(), '/config/redis_config.json'))
    writelog("./log/SystemLog/SystemLog.log", 1, `redis_config 配置文件读取成功！`)
} else {
    consolelog(3, "redis 配置文件丢失，请联系供应商解决！")
    writelog("./log/SystemLog/SystemLog.log", 3, `redis 配置文件丢失，请联系供应商解决！`)
}

try {
    var redisClient = redis.createClient(config.Port, config.IPAddress);

    redisClient.on("error", (err) => {
        // report('RedisError');
        if (/connect ECONNREFUSED/ig.test(err)) {
            consolelog(3, "redis 连接失败，程序未安装或服务未启动！")
            writelog("./log/SystemLog/SystemLog.log", 3, "redis 连接失败，程序未安装或服务未启动！" + err)
        } else if (/read ECONNRESET/ig.test(err)) {
            consolelog(3, "redis 已断开连接！")
            writelog("./log/SystemLog/SystemLog.log", 3, "redis 已断开连接！" + err)
        } else {
            consolelog(3, "redis 发生未知错误！")
            writelog("./log/SystemLog/SystemLog.log", 3, "redis 发生未知错误！" + err)
        }
        consolelog(2, "redis 将自动重连！")
        writelog("./log/SystemLog/SystemLog.log", 2, "redis 将自动重连！")
    });

    redisClient.on("connect", () => {
        consolelog(1, "redis 连接成功！")
        writelog("./log/SystemLog/SystemLog.log", 1, "redis 连接成功！")
    });

    module.exports = session({
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: config.CookieTime,
            secure: false
        },
        rolling: true,
        secret: 'Accurate',
        store: new RedisStore({
            client: redisClient
        }),
    });
} catch {
    consolelog(2, "未找到 redis 配置文件，使用默认 redis 配置！")
    writelog("./log/SystemLog/SystemLog.log", 2, "未找到 redis 配置文件，使用默认 redis 配置！")
    var redisClient = redis.createClient(6379, "127.0.0.1");

    redisClient.on("error", (err) => {
        // report('RedisError');
        if (/connect ECONNREFUSED/ig.test(err)) {
            consolelog(3, "redis 连接失败，程序未安装或服务未启动！")
            writelog("./log/SystemLog/SystemLog.log", 3, "redis 连接失败，程序未安装或服务未启动！" + err)
        } else if (/read ECONNRESET/ig.test(err)) {
            consolelog(3, "redis 已断开连接！")
            writelog("./log/SystemLog/SystemLog.log", 3, "redis 已断开连接！" + err)
        } else {
            consolelog(3, "redis 发生未知错误！")
            writelog("./log/SystemLog/SystemLog.log", 3, "redis 发生未知错误！" + err)
        }
        consolelog(2, "redis 将自动重连！")
        writelog("./log/SystemLog/SystemLog.log", 2, "redis 将自动重连！")
    });

    redisClient.on("connect", function (err) {
        // report('RedisError');
        consolelog(1, "redis 连接成功！")
        writelog("./log/SystemLog/SystemLog.log", 1, "redis 连接成功！")
    });

    module.exports = session({
        saveUninitialized: false,
        resave: true,
        cookie: {
            maxAge: 1000 * 5 * 60 * 60,
            secure: false
        },
        rolling: true,
        secret: 'Accurate',
        store: new RedisStore({
            client: redisClient
        })
    })
}
