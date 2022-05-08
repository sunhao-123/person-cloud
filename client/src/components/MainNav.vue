<template>
  <div class="MainNav">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in getRouters"
        :to="item.path"
        :key="index"
      >
        {{ item.meta.cnName || item.name }}
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ $route.meta.cnName || $route.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="login">
      <span>用户：{{ userInfo.username }}</span>
      <a class="logout" @click="logout" href="javascript:void(0);">退出登陆</a>
    </div>
  </div>
</template>

<script>
import { ifLogin, logout } from "../api";
export default {
  name: "MainNav",
  data() {
    return {
      userInfo: {},
    };
  },
  computed: {
    getRouters() {
      let arr = [...this.$route.matched];
      arr.pop();
      return arr;
    },
  },
  watch: {
    $route(router) {},
  },
  methods: {
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
    logout() {
      logout()
        .then((res) => {
          if (res.data.code === 0) {
            this.$notify({
              title: "成功",
              message: "退出登录成功！",
              type: "success",
            });
            location.reload();
          } else {
            this.$notify({
              title: "错误",
              message: "退出登录失败！",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$notify({
            title: "错误",
            message: "退出登录失败！",
            type: "error",
          });
        });
    },
  },
  mounted() {
    this.ifLogin();
  },
};
</script>

<style scoped lang="less">
.MainNav {
  box-sizing: border-box;
  padding: 0 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 1160px;
  height: 50px;
  background-color: #d8ecec;
  .el-breadcrumb {
    line-height: 50px;
    width: 80%;
    float: left;
  }
  .login {
    line-height: 50px;
    float: right;
    width: 15%;
    .logout {
      margin-left: 25px;
      color: #606266;
    }
  }
}
</style>
