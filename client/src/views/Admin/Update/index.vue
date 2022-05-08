<template>
  <div>
    <div class="upLoadBox" :style="style">
      <div class="upLoadBox1">
        <p class="tip">当前客户端最新版本：V{{ nowVersion }}</p>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="this.hostUrl + '/update/UploadUpdateFile'"
          :on-success="success"
          multiple
          accept=",.exe,.zip"
          :file-list="fileList"
          :auto-upload="false"
          :show-file-list="true"
          :with-credentials="true"
          :drag="true"
          :before-upload="beforeUpload"
          :limit="1"
          :data="{ version: input }"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            <p>将更新文件拖到此处，或<em>点击上传</em>。</p>
            <p>仅支持.exe/.zip文件。</p>
          </div>
        </el-upload>
      </div>
      <el-input
        v-model="input"
        style="width: 325px; margin-top: 10px; margin-right: 10px"
        size="small"
        placeholder="请输入软件版本号 eg: V1.0.2.5"
        @keyup.enter.native="submitUpload"
      ></el-input>
      <el-button
        class="btn"
        size="small"
        type="primary"
        @click="submitUpload"
        :disabled="!/^V[0-9]{1}\.[0-9]{1}\.[0-9]{1}\.[0-9]{1,2}$/.test(input)"
        >上传到服务器</el-button
      >
    </div>
  </div>
</template>

<script>
import { getVersion } from "../../../api";

export default {
  name: "Update",
  data() {
    return {
      fileList: [],
      input: "",
      fullHeight: document.documentElement.clientHeight,
      height: document.documentElement.clientHeight - 50,
      style: "",
      nowVersion: "",
      hostUrl: "",
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
      this.height = this.fullHeight - 50;
      this.style = { paddingTop: this.height / 2 - 220 + "px" };
    },
  },
  methods: {
    beforeUpload(file) {
      if (this.input === "") {
        this.$alert("请输入软件版本号", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {},
        });
        return false;
      } else {
        return true;
      }
    },
    success(response, file, fileList) {
      this.input = "";
      this.fileList = [];
      this.$confirm(response, "确认信息", {
        distinguishCancelAndClose: false,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(() => {})
        .catch((action) => {});
      if (response === "OK") {
        this.$refs.upload.clearFiles();
        this.$confirm("文件上传完成。", "确认信息", {
          distinguishCancelAndClose: false,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        })
          .then(() => {
            getVersion()
              .then((data) => {
                this.nowVersion = data.data;
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((action) => {});
      } else if (response === "ERROR") {
        this.$refs.upload.clearFiles();
        this.$confirm("文件上传失败。", "确认信息", {
          distinguishCancelAndClose: false,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        })
          .then(() => {})
          .catch((action) => {});
      }
    },
    submitUpload() {
      if (/^V[0-9]{1}\.[0-9]{1}\.[0-9]{1}\.[0-9]{1,2}$/.test(this.input)) {
        this.$refs.upload.submit();
      }
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
    this.height = this.fullHeight - 50;
    this.style = { paddingTop: this.height / 2 - 220 + "px" };
    getVersion()
      .then((data) => {
        this.nowVersion = data.data;
      })
      .catch((err) => {
        console.log(err);
      });

    let protocol = window.location.protocol; //协议
    let host = window.location.host; //主机
    if (/127.0.0.1/.test(host)) {
      this.hostUrl = protocol + "//127.0.0.1:8081";
    } else {
      this.hostUrl = `${protocol}//${host}`;
    }
  },
};
</script>
<style lang="less">
p {
  width: 100%;
}
.upLoadBox {
  box-sizing: border-box;
  width: 440px;
  margin: 0 auto;
  padding-top: 200px;
}
.upLoadBox1 {
  box-sizing: border-box;
  width: 440px;
  margin: 0 auto;
  padding: 20px 40px 40px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  .tip {
    margin-bottom: 5px;
  }
}
.btn {
  margin: 10px auto;
}
@media screen and (max-width: 1367px) {
  .upLoadBox {
    padding-top: 100px;
  }
}
</style>