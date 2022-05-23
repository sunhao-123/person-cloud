<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import config from '../package.json'
import { getClientVersion, getServiceVersion } from "./api";
export default {
  mounted() {
    console.log("%cLEAR JINBEI PBL & Auto Call-off System", "color: #E82C17; font-size: 18px");
    console.log("%cCopyright © 2022 Shenyang Accurate Technology Co., Ltd.", "color: #005FA1; font-size: 18px");
    console.log("%cAuthor: Sun Hao", "color: #0DBC79; font-size: 18px");
    Promise.all([getClientVersion(), getServiceVersion()])
      .then(data => {
        console.group(`%cVersion:`, "color: #409EFF; font-size: 18px");
        console.log(`%cManagement Version: ${config.version}.0`, "color: #409EFF; font-size: 18px");
        console.log(`%cClient Version: ${data[0].data}`, "color: #409EFF; font-size: 18px");
        console.log(`%cService Version: ${data[1].data}`, "color: #409EFF; font-size: 18px");
        console.groupEnd();
      })
      .catch(err => {
        console.group(`%cVersion:`, "color: #409EFF; font-size: 18px");
        console.log(`%c获取版本号失败${err}`, "color: #409EFF; font-size: 18px");
        console.groupEnd();
      })
  },
};
</script>

<style lang="less">
.tableboxtop50 {
  position: relative;
  top: -30px;
}
</style>
