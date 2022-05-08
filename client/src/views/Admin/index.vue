<template>
  <div>
    <el-container>
      <el-aside :width="isCollapse ? '64' : '200'">
        <Menu :isCollapse="isCollapse"></Menu>
      </el-aside>
      <el-main>
        <div class="btnbox" @click="showmenu">
          <div class="pbox">
            <i class="el-icon-arrow-left" v-if="!isCollapse"></i>
            <i class="el-icon-arrow-right" v-if="isCollapse"></i>
          </div>
        </div>
        <MainNav></MainNav>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Menu from "../../components/Menu";
import MainNav from "../../components/MainNav";
export default {
  name: "Admin",
  components: {
    Menu,
    MainNav,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    showmenu() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped lang="less">
.el-aside {
  overflow: hidden;
  height: 100vh;
  background-color: rgb(84, 92, 100);
}
.el-main {
  padding: 60px 30px 0;
  position: relative;
  // height: 100vh;
  background-color: azure;
  overflow: hidden;
}
.btnbox {
  cursor: pointer;
  border-radius: 0 50% 50% 0;
  display: block;
  float: left;
  position: relative;
  top: 43%;
  left: -35px;
  width: 25px;
  height: 39px;
  text-align: center;
  line-height: 39px;
  background-color: #545c64;
  color: #fff;
  font-size: 25px;
}
</style>
