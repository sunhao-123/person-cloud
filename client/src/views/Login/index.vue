<template>
  <div class="loginbg" :style="style">
    <el-dialog
      title="Picking By Light & Auto Calloff System Login"
      :visible="true"
      width="430px"
      :modal="false"
      :before-close="beforeClose"
      :close-on-click-modal="false"
      :show-close="false"
      style="margin-top: 100px"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="user">
          <el-input v-model="form.user" @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="form.pwd" show-password @keyup.enter.native="handleClick"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="handleClick"
          :disabled="submitDisabled"
          >登录</el-button
        >
      </span>
    </el-dialog>
    <p class="Copyright">
      Copyright © 2019-2022 Shenyang Accurate Technology Co., Ltd. 版权所有
    </p>
  </div>
</template>

<script>
import { login } from "../../api";
import crypto from "crypto";

export default {
  name: "Login",
  data() {
    return {
      //表单数据
      form: {
        user: "",
        pwd: "",
      },
      fullHeight: document.documentElement.clientHeight,
      style: { height: document.documentElement.clientHeight + "px" },
      //表单验证
      rules: {
        //用户名验证
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            //数据类型
            type: "string",
            //正则规则
            pattern: /^[\w\u4e00-\u9fa5\uac00-\ud7ff\u0800-\u4e00\-]{2,7}$/,
            message: "请输入正确格式用户名",
            trigger: ["blur", "change"],
          },
        ],

        //密码验证
        pwd: {
          type: "string",
          validator: (rule, value, cb) => {
            if (value) {
              //验证密码是否符合规则
              if (/^[\w<>,.?|;':"{}!@#$%^&*()\/\-\[\]\\]{5,18}$/.test(value)) {
                cb();
              } else {
                cb(new Error("请输入正确格式密码"));
              }
            } else {
              cb(new Error("请输入密码"));
            }

            //在这里还需要触发确认密码的验证
            this.form.checkPwd && this.$refs.form.validateField("checkPwd");
          },
          required: true,
          trigger: ["blur", "change"],
        },
      },

      //登录过程禁用
      submitDisabled: false,
    };
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function () {
          that.timer = false;
        }, 400);
      }
      this.style = { height: this.fullHeight + "px" };
    },
  },
  methods: {
    beforeClose() {},
    handleClick() {
      this.submitDisabled = true; //禁用点击

      //验证数据
      this.$refs["form"].validate((valid) => {
        if (valid) {
          //验证都通过
          let newForm = {
            pwd: crypto
              .createHash("sha256")
              .update(this.form.pwd)
              .digest("hex"),
            user: this.form.user,
          };
          login(newForm)
            .then((res) => {
              // console.log(res.data);
              if (res.data.code !== 0) {
                //登陆失败
                this.submitDisabled = false;
                this.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 2000,
                });
              } else {
                //登陆成功
                this.submitDisabled = false;
                sessionStorage.setItem("username", this.form.user);
                this.$router.push("/admin").catch((err) => {
                  console.log(err);
                });
              }
            })
            .catch(() => {
              this.submitDisabled = false;
              this.$message({
                message: "登陆失败，请稍后再试",
                type: "error",
                duration: 2000,
              });
            });
        } else {
          //验证没通过
          this.submitDisabled = false;
          return false;
        }
      });
    },
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        that.fullHeight = window.fullHeight;
      })();
    };
    this.style = { height: this.fullHeight + "px" };
  },
};
</script>

<style lang="less" scoped>
.loginbg {
  width: 100%;
  height: 100%;
  background: url("../../assets/background_anima.png") center/cover;
}
.Copyright {
  position: absolute;
  bottom: 0;
  width: 100%;
  color: #000;
  background-color: rgba(255, 255, 255, 0.6);
  text-align: center;
}
/deep/.el-dialog__body {
  padding-bottom: 0;
}
/deep/.el-dialog__header {
  padding: 30px 20px 10px;
}
</style>
