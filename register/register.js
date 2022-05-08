const fs = require('fs-extra');
const path = require('path');
let licensePath = path.join(process.cwd(), '/LICENSE')
const { machineIdSync } = require('node-machine-id');
const { Base64 } = require('js-base64');
const crypto = require("crypto");
const readline = require('readline');
const gettime = require('./gettime');
require('draftlog').into(console)

input()

let time = ""
let enterFlag = true
let inputFlag = true
var upconsole = console.draft(time)
var uptip = console.draft("")
var uppause = console.draft("")

function pause() {
    uppause("按任意键退出...")
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    process.stdin.on('keypress', (str, key) => {
        process.exit(0)
    })
}

function input() {
    console.log("请输入授权时长：（例：1年 ==> 1y；2个月 ==> 2m；3周：3w；4天：4d）")
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
        if (inputFlag) {
            if (key.name === 'return') {
                let timelong = (time.substring(0, time.length - 1)) * 1
                let unit = time[time.length - 1]
                if (!timelong || (unit !== "y" && unit !== "m" && unit !== "w" && unit !== "d")) {
                    uptip("输入错误，请重新输入！")
                    time = ""
                    upconsole(time)
                } else {
                    inputFlag = false
                    register(timelong, unit)
                    time = ""
                }
            } else if (key.name === 'backspace') {
                uptip("")
                time = time.substring(0, time.length - 1)
                upconsole(time)
            } else if (key.ctrl === true && key.name === 'c') {
                process.exit(0)
            } else {
                uptip("")
                time += key.sequence
                upconsole(time)
            }
        }
    })
}

function register(timelong, unit) {
    let now = new Date()
    // let unitTime = unit === "y" ? 1000 * 60 * 60 * 24 * 365 : unit === "m" ? 1000 * 60 * 60 * 24 * 30 : unit === "w" ? 1000 * 60 * 60 * 24 * 7 : unit === "d" ? 1000 * 60 * 60 * 24 : 0
    let overTime = new Date()
    if (unit === "y") {
        overTime = now.setFullYear(now.getFullYear() + timelong);
    } else if (unit === "m") {
        overTime = now.setMonth(now.getMonth() + timelong);
    } else if (unit === "w") {
        overTime = now.getTime() + 1000 * 60 * 60 * 24 * 7 * timelong;
    } else if (unit === "d") {
        overTime = now.getTime() + 1000 * 60 * 60 * 24 * timelong;
    }
    let hextime = new Date(overTime).getTime().toString(16)

    let machineId = machineIdSync();
    // console.log(machineId)
    let base64MachineId = Base64.encode(machineId)
    // console.log(base64MachineId)
    let md5Base64MachineId = crypto.createHash("sha256").update(base64MachineId).digest("hex")
    // console.log(md5Base64MachineId); 
    let overlisence = md5Base64MachineId + hextime
    // console.log(overlisence)
    fs.writeFile(licensePath, overlisence, { encoding: "utf-8", flag: "w" }, (error) => {
        if (error) {
            uptip("\033[40;35m【ERROR】===> LICENSE写入出错 " + error + "\033[0m");
            pause()
        } else {
            uptip("\033[40;32m【SUCCESS】===> 软件注册成功！过期时间：" + `${gettime("YYYY年MM月DD日 HH:mm:ss", overTime)}` + "\033[0m");
            pause()
        }
    });
}