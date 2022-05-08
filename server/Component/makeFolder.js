const fs = require('fs-extra')
const desiredMode = 0o2775
const path = require('path')

const consolelog = require('./consolelog')
const writelog = require('./writelog')

let copyXMLFilesFolder = path.join(process.cwd(), 'copyXMLFiles')
fs.ensureDir(copyXMLFilesFolder, desiredMode)
    .then(() => {
        writelog("./log/SystemLog/SystemLog.log", 1, `已确保 ${copyXMLFilesFolder} 文件夹存在！`)
    })
    .catch(err => {
        consolelog(3, `${copyXMLFilesFolder} 文件夹不存在且创建失败！`)
        writelog("./log/SystemLog/SystemLog.log", 3, `${copyXMLFilesFolder} 文件夹不存在且创建失败！${err}`)
    })


let uploadFileFolder = path.join(process.cwd(), 'uploadFile')
fs.ensureDir(uploadFileFolder, desiredMode)
    .then(() => {
        writelog("./log/SystemLog/SystemLog.log", 1, `已确保 ${uploadFileFolder} 文件夹存在！`)
    })
    .catch(err => {
        consolelog(3, `${uploadFileFolder} 文件夹不存在且创建失败！`)
        writelog("./log/SystemLog/SystemLog.log", 3, `${uploadFileFolder} 文件夹不存在且创建失败！${err}`)
    })


let XMLFilesFolder = path.join(process.cwd(), 'XMLFiles')
fs.ensureDir(XMLFilesFolder, desiredMode)
    .then(() => {
        writelog("./log/SystemLog/SystemLog.log", 1, `已确保 ${XMLFilesFolder} 文件夹存在！`)
    })
    .catch(err => {
        consolelog(3, `${XMLFilesFolder} 文件夹不存在且创建失败！`)
        writelog("./log/SystemLog/SystemLog.log", 3, `${XMLFilesFolder} 文件夹不存在且创建失败！${err}`)
    })


let UpdateFiles = path.join(process.cwd(), '/UpdateFiles')
fs.ensureDir(UpdateFiles, desiredMode)
    .then(() => {
        writelog("./log/SystemLog/SystemLog.log", 1, `已确保 ${UpdateFiles} 文件夹存在！`)
    })
    .catch(err => {
        consolelog(3, `${UpdateFiles} 文件夹不存在且创建失败！`)
        writelog("./log/SystemLog/SystemLog.log", 3, `${UpdateFiles} 文件夹不存在且创建失败！${err}`)
    })


let FinishXmlFiles = path.join(process.cwd(), '/FinishXmlFiles')
fs.ensureDir(FinishXmlFiles, desiredMode)
    .then(() => {
        writelog("./log/SystemLog/SystemLog.log", 1, `已确保 ${FinishXmlFiles} 文件夹存在！`)
    })
    .catch(err => {
        consolelog(3, `${FinishXmlFiles} 文件夹不存在且创建失败！`)
        writelog("./log/SystemLog/SystemLog.log", 3, `${FinishXmlFiles} 文件夹不存在且创建失败！${err}`)
    })