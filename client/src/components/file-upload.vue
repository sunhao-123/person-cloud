<template>
  <el-dialog
    title="上传文件"
    :visible.sync="dialogVisible"
    width="600px"
    :close-on-click-modal="true"
    :before-close="handleClose"
  >
    <div class="upbox">
      <el-upload
        drag
        :multiple="false"
        ref="upload"
        :action="this.hostUrl + '/web/uploadLocationFile'"
        :auto-upload="false"
        :data="{user}"
        :on-success="dealSuccess"
        :on-error="dealError"
      >
        <i class="el-icon-upload"></i>

        <!-- :action="hostUrl + '/file/add'" -->
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-button
        style="margin: 15px auto 0"
        size="small"
        type="success"
        @click="submitUpload"
        >开始上传</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      hostUrl: "",
      user: sessionStorage.getItem("username"),
    };
  },
  props: ["dialogVisible"],
  watch: {},
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    dealSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.$message.success("库位表更新成功!");
        this.$alert(response.msg, "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.handleClose();
          },
        });
      } else {
        this.$alert(response.msg, "提示", {
          confirmButtonText: "确定",
        });
      }
      this.$refs.upload.clearFiles();
    },
    handleClose() {
      this.$emit("closeUpload");
    },
    dealError() {
      this.$message.error("上传文件失败,请重新上传!");
    },
  },
  mounted() {
    // console.log(sessionStorage)
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
<style scoped>
.upbox {
  width: 100%;
  text-align: center;
}
</style>
