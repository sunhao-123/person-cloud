const express = require("express");
var path = require("path");

const router = express.Router();

//下载模板库位
router.get("/LocationTemplate", (req, res) => {
    let filepath = path.join(process.cwd(), '/template/Location Template.xlsx')
    res.download(filepath, "Location_Template.xlsx");
});

//下载更新文件
router.get("/Update", (req, res) => {
    let version = req.query.version
    let mode = req.query.mode
    let filepath = path.join(process.cwd(), `/UpdateFiles/${version}/Update.${mode}`)
    res.download(filepath, `Update.${mode}`);
});

module.exports = router;