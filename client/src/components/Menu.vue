<template>
  <el-menu
    :default-active="defaultActive"
    :collapse="isCollapse"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :unique-opened="true"
    @open="handleOpen"
    :router="true"
    ref="menu"
  >
    <el-menu-item @click="handleClick" index="/admin">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item @click="handleClick" index="/admin/location">
      <i class="el-icon-s-grid"></i>
      <span slot="title">库位编辑</span>
    </el-menu-item>
    
    <el-menu-item @click="handleClick" index="/admin/viewtask">
      <i class="el-icon-receiving"></i>
      <span slot="title">拣选任务</span>
    </el-menu-item>
    
    <el-menu-item @click="handleClick" index="/admin/viewreprint">
      <i class="el-icon-printer"></i>
      <span slot="title">补打任务</span>
    </el-menu-item>
    
    <el-menu-item @click="handleClick" index="/admin/UserAdmin">
      <i class="el-icon-s-custom"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    
    <el-menu-item @click="handleClick" index="/admin/viewlog">
      <i class="el-icon-s-order"></i>
      <span slot="title">系统日志</span>
    </el-menu-item>
    
    <el-menu-item @click="handleClick" index="/admin/viewNetlog">
      <i class="el-icon-connection"></i>
      <span slot="title">网络日志</span>
    </el-menu-item>
    
    <el-menu-item @click="handleClick" index="/admin/update">
      <i class="el-icon-upload2"></i>
      <span slot="title">程序更新</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { ifLogin } from "../api";
export default {
  name: "Menu",
  props: ["isCollapse"],
  data() {
    return {
      defaultActive: "",
      userInfo: {},
      show42: true,
      show32: false,
    };
  },
  watch: {
    $route() {
      this.defaultActive = this.$route.path;
    },
    // isCollapse(val) {
    //   if (val) {
    //     document.querySelector(".btnbox").style.marginLeft = "64px";
    //   } else {
    //     document.querySelector(".btnbox").style.marginLeft = "200px";
    //   }
    // },
  },
  methods: {
    handleOpen(index) {},
    handleClick() {
      this.$refs.menu.activeIndex = this.$route.path;
    },
    ifLogin() {
      ifLogin()
        .then((res) => {
          if (!res.data.userInfo) {
            this.userInfo = {};
          } else {
            this.userInfo = res.data.userInfo;
          }
        })
        .catch(() => {
          this.userInfo = {};
        });
    },
  },
  mounted() {
    this.defaultActive = this.$route.path;
    this.ifLogin();
  },
};
</script>

<style scoped lang="less">
.el-menu {
  border: 0;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  position: relative;
  float: left;
  user-select: none;
  width: 200px;
  min-height: 400px;
}
</style>
