const express = require("express");
const consolelog = require("../../Component/consolelog");
const writelog = require('../../Component/writelog')
const writelogsql = require('../../Component/writelogsql');
const runSql = require('../../db/datebase');

const router = express.Router();

router.post("/", (req, res) => {
    let username = req.body.user
    let password = req.body.pwd
    runSql(
        "SELECT * FROM dbo.t_user " +
        `WHERE username = '${username}'`
    )
        .then(data => {
            if (data.rowsAffected[0] === 0) {
                writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 登录后台管理系统失败，用户名不存在！`)
                writelogsql(2, `用户：${username} 登录后台管理系统失败，用户名不存在！`)
                consolelog(2, `用户：${username} 登录后台管理系统失败，用户名不存在！`)
                res.send({
                    code: 1,
                    msg: "用户名不存在！"
                });
            } else {
                if (data.recordset[0].password === password) {
                    if (data.recordset[0].isAdmin) {
                        req.session.login = {
                            UID: data.recordset[0].UID,
                            username: data.recordset[0].username
                        };
                        // console.log(req.session)
                        writelog("./log/SystemLog/SystemLog.log", 1, `用户：${username} 在后台管理系统登录成功！`)
                        writelogsql(1, `用户：${username} 在后台管理系统登录成功！`)
                        //返回前端
                        res.send({
                            code: 0,
                            msg: "登录成功"
                        });
                    } else {
                        writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 试图登录后台管理系统，由于权限不足被禁止！`)
                        writelogsql(2, `用户：${username} 试图登录后台管理系统，由于权限不足被禁止！`)
                        consolelog(2, `用户：${username} 试图登录后台管理系统，由于权限不足被禁止！`)
                        res.send({
                            code: 3,
                            msg: "您没有权限登录此系统！"
                        });
                    }
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 2, `用户：${username} 登录后台管理系统失败，密码错误！`)
                    writelogsql(2, `用户：${username} 登录后台管理系统失败，密码错误！`)
                    consolelog(2, `用户：${username} 登录后台管理系统失败，密码错误！`)
                    res.send({
                        code: 2,
                        msg: "密码错误！"
                    });
                }
            }
        })
        .catch(err => {
            // console.log(err)
            writelog("./log/SystemLog/SystemLog.log", 3, `用户：${username} 登录后台管理系统失败，服务器错误！${err}`)
            writelogsql(3, `用户：${username} 登录后台管理系统失败，服务器错误！${err}`)
            consolelog(3, `用户：${username} 登录后台管理系统失败！`)
            res.send({
                code: 4,
                msg: "未知错误！" + err
            });
        })
});

//验证是否登录
router.post("/ifLogin", (req, res) => {
    let data = req.session.login;
    let resData = false;
    if (data) {
        resData = data;
    }
    res.send({
        userInfo: resData
    });
});

//登出
router.get("/logout", (req, res) => {
    // console.log(req.session)
    writelog("./log/SystemLog/SystemLog.log", 1, `用户：${req.session.login.username} 已退出登录！`)
    writelogsql(1, `用户：${req.session.login.username} 已退出登录！`)
    req.session.destroy();
    writelog("./log/SystemLog/SystemLog.log", 1, `session清理完成！`)
    writelogsql(1, `session清理完成！`)
    res.send({
        code: 0,
        msg: "退出登陆成功"
    });
});

module.exports = router;