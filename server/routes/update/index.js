const express = require("express");
const fs = require("fs");
const multer = require('multer');
const path = require("path");
const writelog = require('../../Component/writelog');
const writelogsql = require('../../Component/writelogsql');
const consolelog = require("../../Component/consolelog");

let router = express.Router();

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), '/UpdateFiles'));
    },
    filename: function (req, file, cb) {
        let fileName = "Update" + file.originalname.match(/\.(zip|exe)$/i)[0];
        cb(null, fileName);
    }
});
let upload = multer({ storage }).any();

router.post("/UploadUpdateFile", (req, res) => {
    upload(req, res, function (err) {
        //发生错误
        if (err instanceof multer.MulterError) {
            writelog("./log/SystemLog/SystemLog.log", 3, "上传更新文件Multer错误！" + err)
            consolelog(3, "上传更新文件Multer错误！")
            writelogsql(3, "上传更新文件Multer错误！" + err)
            res.sendStatus(500);
        } else if (err) {
            writelog("./log/SystemLog/SystemLog.log", 3, "上传更新文件错误！" + err)
            consolelog(3, "上传更新文件错误！")
            writelogsql(3, "上传更新文件错误！" + err)
            res.sendStatus(500);
        } else {
            //一切都好
            writelog("./log/SystemLog/SystemLog.log", 1, "上传更新文件成功！")
            writelogsql(1, "上传更新文件成功！")
            let folderPath = path.join(process.cwd(), `/UpdateFiles/${req.body.version.replace("V", "")}/`)
            fs.mkdir(folderPath, err => {
                if (err) {
                    writelog("./log/SystemLog/SystemLog.log", 3, `创建${req.body.version}版本更新文件夹错误！${err}`)
                    consolelog(3, `创建${req.body.version}版本更新文件夹错误！`)
                    writelogsql(3, `创建${req.body.version}版本更新文件夹错误！${err}`)
                    res.sendStatus("500")
                } else {
                    writelog("./log/SystemLog/SystemLog.log", 1, `创建${req.body.version}版本更新文件夹成功！`)
                    writelogsql(1, `创建${req.body.version}版本更新文件夹成功！`)
                    let filePath = req.files[0].path
                    let fileName = req.files[0].filename
                    let newFliePath = path.join(process.cwd(), `/UpdateFiles/${req.body.version.replace("V", "")}/${fileName}`)
                    if (fs.existsSync(filePath)) {
                        fs.renameSync(filePath, newFliePath);
                        writelog("./log/SystemLog/SystemLog.log", 1, `更新文件上传并移动成功！`)
                        writelogsql(1, `更新文件上传并移动成功！`)
                        res.send("OK")
                    } else {
                        writelog("./log/SystemLog/SystemLog.log", 3, `版本更新文件不存在！`)
                        consolelog(3, `版本更新文件不存在！`)
                        writelogsql(3, `版本更新文件不存在！`)
                        res.send("ERROR")
                    }
                }
            })
        }
    })
});

/* 获取版本 */
router.get("/getVersion", (req, res) => {
    let filepath = path.join(process.cwd(), '/UpdateFiles')
    fs.readdir(`${filepath}`, (err, fileList) => {
        if (err) {
            writelog("./log/SystemLog/SystemLog.log", 3, `访问版本更新文件夹 ${filepath} 错误！${err}`)
            consolelog(3, `访问版本更新文件夹 ${filepath} 错误！`)
            writelogsql(3, `访问版本更新文件夹 ${filepath} 错误！${err}`)
            res.send("0.0.0.0")
        } else {
            let v = "0.0.0.0"
            for (let i = 0; i < fileList.length; i++) {
                v = compairVersion(v, fileList[i])
            }
            writelog("./log/SystemLog/SystemLog.log", 1, `获取版本号成功！${v}`)
            writelogsql(1, `获取版本号成功！${v}`)
            res.send(v)
        }
    })
})

/* 获取版本 */
router.get("/getAllVersion", (req, res) => {
    let filepath = path.join(process.cwd(), '/UpdateFiles')
    fs.readdir(`${filepath}`, (err, fileList) => {
        if (err) {
            writelog("./log/SystemLog/SystemLog.log", 3, `访问版本更新文件夹 ${filepath} 错误！${err}`)
            consolelog(3, `访问版本更新文件夹 ${filepath} 错误！`)
            writelogsql(3, `访问版本更新文件夹 ${filepath} 错误！${err}`)
            res.send("0.0.0.0-nuk")
        } else {
            let v = []
            for (let i = 0; i < fileList.length; i++) {
                let filepath1 = path.join(process.cwd(), `/UpdateFiles/${fileList[i]}`)
                try {
                    let fileList1 = fs.readdirSync(`${filepath1}`)
                    let mode = path.extname(fileList1[0]);
                    let m = mode.replace(".", "")
                    writelog("./log/SystemLog/SystemLog.log", 1, `获取版本文件格式成功！${m}`)
                    writelogsql(1, `获取版本文件格式成功！${m}`)
                    v.push(`${fileList[i]}-${m}`)
                } catch (err) {
                    writelog("./log/SystemLog/SystemLog.log", 3, `获取版本文件格式失败！${err}`)
                    consolelog(3, `获取版本文件格式失败！`)
                    writelogsql(3, `获取版本文件格式失败！${err}`)
                    v.push(`${fileList[i]}-unk`)
                }
            }
            if (v.length == 0) {
                v = ["0.0.0.0-unk"]
            }
            writelog("./log/SystemLog/SystemLog.log", 1, `获取版本号列表成功！`)
            writelogsql(1, `获取版本号列表成功！`)
            res.send(v.join(","))
        }
    })
})

/* 获取格式 */
router.get("/getMode", (req, res) => {
    if (req.query.version) {
        let filepath = path.join(process.cwd(), `/UpdateFiles/${req.query.version}`)
        fs.readdir(`${filepath}`, (err, fileList) => {
            if (err) {
                writelog("./log/SystemLog/SystemLog.log", 3, `访问版本更新文件夹 ${filepath} 错误！${err}`)
                consolelog(3, `访问版本更新文件夹 ${filepath} 错误！`)
                writelogsql(3, `访问版本更新文件夹 ${filepath} 错误！${err}`)
                res.send('unknown')
            } else {
                let mode = ""
                for (let i = 0; i < fileList.length; i++) {
                    mode = path.extname(fileList[i]);
                }
                let m = mode.replace(".", "")
                writelog("./log/SystemLog/SystemLog.log", 1, `获取版本文件格式成功！${m}`)
                writelogsql(1, `获取版本文件格式成功！${m}`)
                res.send(m)
            }
        })
    } else {
        writelog("./log/SystemLog/SystemLog.log", 3, "访问 /update/getMode 接口错误，参数缺失！")
        consolelog(3, "访问 /update/getMode 接口错误，参数缺失！")
        writelogsql(3, "访问 /update/getMode 接口错误，参数缺失！")
        res.send("访问 /update/getMode 接口错误，参数缺失！")
    }
})


function compairVersion(v1, v2) {
    //补位0，或者使用其它字符
    const ZERO_STR = '000000000000000000000000000000000000000000';
    if (v1 === v2) {
        return v1;
    }
    let len1 = v1 ? v1.length : 0;
    let len2 = v2 ? v2.length : 0;
    if (len1 === 0 && len2 === 0) {
        return v1;
    }
    if (len1 === 0) {
        return v2;
    }
    if (len2 === 0) {
        return v1;
    }
    const arr1 = v1.split('.');
    const arr2 = v2.split('.');
    const length = Math.min(arr1.length, arr2.length);
    for (let i = 0; i < length; i++) {
        let a = arr1[i];
        let b = arr2[i];
        if (a.length < b.length) {
            a = ZERO_STR.substr(0, b.length - a.length) + a;
        } else if (a.length > b.length) {
            b = ZERO_STR.substr(0, a.length - b.length) + b;
        }
        if (a < b) {
            return v2;
        } else if (a > b) {
            return v1;
        }
    }
    if (arr1.length < arr2.length) {
        return v2;
    } else if (arr1.length > arr2.length) {
        return v1;
    }
    return v1;
}

module.exports = router;