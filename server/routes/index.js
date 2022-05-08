var express = require('express');
var router = express.Router();

/*picking接口*/
router.use("/api",require('../routes/api/index'));

/*后台管理接口*/
router.use("/web",require('../routes/web/index'));

/*王春博接口*/
router.use("/login",require('../routes/login/index'));

/*下载接口*/
router.use("/download",require('../routes/download/index'));

/*更新接口*/
router.use("/update",require('../routes/update/index'));


module.exports = router;
