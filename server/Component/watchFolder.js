const fs = require('fs-extra');
const { access, constants } = require('fs');
const chokidar = require('chokidar');
const consolelog = require('./consolelog');
const writelog = require('./writelog');
var path = require("path");
const ParseXML = require('./ParseXML');

const watchFolder = (XMLFiles, copyXMLFiles) => {

    let dir = XMLFiles
    let copyDir = copyXMLFiles
    // let watcher = watch(dir, { recursive: true });
    const watcher = chokidar.watch(dir, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    watcher
        .on('add', (name) => {
            let filename = path.basename(name)
            if (!fileIsBusy(dir, filename)) {
                consolelog(1, `监听到新文件 ${name} ！`)
                writelog("./log/SystemLog/SystemLog.log", 1, `监听到新文件 ${name} ！`)
                setTimeout(function () {
                    access(`${dir}/${filename}`, constants.F_OK, (err) => {
                        if (err) {
                            consolelog(3, `文件 ${name} 不存在！`)
                            writelog("./log/SystemLog/SystemLog.log", 3, `文件 ${name} 不存在！`)
                        } else {
                            let newFilePath = `${copyDir}/${filename}`.replace(/\//g, "\\")
                            fs.rename(`${dir}/${filename}`, newFilePath, (err, data) => {
                                if (err) {
                                    consolelog(3, `文件 ${name} 移动失败！`)
                                    writelog("./log/SystemLog/SystemLog.log", 3, `文件 ${name} 移动失败！` + err)
                                } else {
                                    writelog("./log/SystemLog/SystemLog.log", 1, `文件 ${name} 已移动到 ${newFilePath} ！`)
                                    ParseXML(newFilePath)
                                }
                            })
                        }
                    });
                }, 5000)
            }
        })
        .on('change', (name) => {
            writelog("./log/SystemLog/SystemLog.log", 2, `文件 ${name} 已修改！`)
        })
        .on('error', (err) => {
            consolelog(3, "监听XML文件夹遇到错误！")
            writelog("./log/SystemLog/SystemLog.log", 3, "监听XML文件夹遇到错误！" + err)
        })
        .on('ready', () => {
            consolelog(1, "正在监听XML文件夹！")
            writelog("./log/SystemLog/SystemLog.log", 1, `正在监听XML文件夹！`)
        })
}

function fileIsBusy(dir, name) {
    fs.rename(`${dir}/${name}`, `${dir}/${name}`, (err, data) => {
        if (err) {
            return true
        } else {
            return false
        }
    })
}

module.exports = watchFolder