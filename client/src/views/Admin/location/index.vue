<template>
  <div class="bigBox">
    <div class="chickLocation">
      <el-select size="small" v-model="nowStation" @change="handleClick" placeholder="请选择">
        <el-option v-for="item in station" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select size="small" v-model="nowLocation" @change="handleClick" placeholder="请选择">
        <el-option v-for="item in location" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <div class="saveBtn">
        <el-button type="primary" round size="small" @click="handleSave" :disabled="isSame">保存库位信息</el-button>
      </div>
      <div class="outputBtn">
        <el-button type="primary" round size="small" @click="outputExcel">导出当前库位</el-button>
      </div>
      <div class="uploadBtn">
        <el-button type="primary" round size="small" @click="uploadExcel">导入Excel</el-button>
      </div>
      <div class="downloadBtn">
        <el-button type="primary" round size="small" @click="downloadExcel">下载导入模板</el-button>
      </div>
    </div>
    <fileUpload ref="upFile" :dialogVisible="ifShowUpload" @closeUpload="closeUpload"></fileUpload>
    <div class="locationBox" :style="style">
      <div class="location" v-for="item in locationList" :key="item.locationNum">
        <p>
          <span style="margin-left: 5px">{{ nowLocation.replace("料架：", "库位: ")
          }}{{ item.locationNum }}</span><span style="margin-left: 20px">{{
    "标签ID: 0" + nowLocation.replace("料架：", "") + item.locationNum
}}</span>
        </p>
        <div class="pnbox">
          <el-input size="small" v-model="item.pn" @input="ifSame()">
            <template slot="prepend">零件号</template>
          </el-input>
        </div>
        <div class="namebox">
          <el-input size="small" v-model="item.name" @input="ifSame()">
            <template slot="prepend">零件描述</template>
          </el-input>
        </div>
        <div class="timebox">
          <!-- <el-input
            size="small"
            type="number"
            v-model="item.time"
            @input="ifSame()"
          >
            <template slot="prepend">补货超时时间(秒)</template>
          </el-input> -->
          <div class="leftBox">超时时间</div>
          <el-time-picker size="small" v-model="item.time" placeholder="请选择时间" @change="ifSame()">
          </el-time-picker>
        </div>
        <!-- <div class="btnBox">
        <el-button type="primary" round size="small">保 存</el-button>
      </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getLocation, updateLocation, getLocationExcel } from "../../../api";
import fileUpload from "../../../components/file-upload.vue";
import getTime from "../../../assets/js/gettime.js";

export default {
  components: { fileUpload },
  name: "CardView",
  data() {
    return {
      isSame: true,
      value1: new Date(),
      ifShowUpload: false,
      nowStation: "工位：1",
      nowLocation: "料架：1",
      lastStation: "工位：1",
      lastLocation: "料架：1",
      station: [
        {
          value: "工位：1",
          label: "工位：1",
        },
        {
          value: "工位：2",
          label: "工位：2",
        },
        {
          value: "工位：3",
          label: "工位：3",
        },
      ],
      location: [
        {
          value: "料架：1",
          label: "料架：1",
        },
        {
          value: "料架：2",
          label: "料架：2",
        },
        {
          value: "料架：3",
          label: "料架：3",
        },
        {
          value: "料架：4",
          label: "料架：4",
        },
        {
          value: "料架：5",
          label: "料架：5",
        },
        {
          value: "料架：6",
          label: "料架：6",
        },
        {
          value: "料架：7",
          label: "料架：7",
        },
        {
          value: "料架：8",
          label: "料架：8",
        },
        {
          value: "料架：9",
          label: "料架：9",
        },
      ],
      locationList: [
        {
          locationNum: 41,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 42,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 43,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 44,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 31,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 32,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 33,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 34,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 21,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 22,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 23,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 24,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 11,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 12,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 13,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 14,
          pn: "",
          name: "",
          time: 0,
        },
      ],
      oldLocationList: [
        {
          locationNum: 41,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 42,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 43,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 44,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 31,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 32,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 33,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 34,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 21,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 22,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 23,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 24,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 11,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 12,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 13,
          pn: "",
          name: "",
          time: 0,
        },
        {
          locationNum: 14,
          pn: "",
          name: "",
          time: 0,
        },
      ],
      search: "",
      fullHeight: document.documentElement.clientHeight,
      height: document.documentElement.clientHeight - 100,
      style: "",
      shift: "白班",
      loading: false,
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
      this.height = this.fullHeight - 170;

      this.style = { height: this.height + "px" };
    },
    nowStation(newval, oldval) {
      this.lastStation = oldval;
      // console.log(this.lastLocation, "lastLocation");
      // console.log(this.nowLocation, "nowLocation");
    },
    nowLocation(newval, oldval) {
      this.lastLocation = oldval;
      // console.log(this.lastLocation, "lastLocation");
      // console.log(this.nowLocation, "nowLocation");
    },
  },
  methods: {
    changeTime(item) { },
    getLocation(station, location) {
      const loading = this.$loading({
        lock: true,
        text: "数据加载中，请稍后......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      getLocation({ station, location })
        .then((data) => {
          if (data.data.code === 0) {
            let locationdata = data.data.data;
            // console.log(locationdata);
            for (let i = 0; i < 16; i++) {
              locationdata.forEach((item) => {
                if (
                  `0${this.nowLocation.replace("料架：", "")}${this.locationList[i].locationNum
                  }` === item.LabelID
                ) {
                  this.locationList[i].pn =
                    item.PartNum === null ? "" : item.PartNum;
                  this.locationList[i].name =
                    item.PartName === null ? "" : item.PartName;
                  this.locationList[i].time =
                    item.Threshold_Time * 1000 + 1577808000000;

                  this.oldLocationList[i].pn =
                    item.PartNum === null ? "" : item.PartNum;
                  this.oldLocationList[i].name =
                    item.PartName === null ? "" : item.PartName;
                  this.oldLocationList[i].time =
                    item.Threshold_Time * 1000 + 1577808000000;
                }
              });
            }
            loading.close();
          }
          this.ifSame();
        })
        .catch((err) => {
          loading.close();
          console.log(err);
          this.ifSame();
          this.locationList = [
            {
              locationNum: 41,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 42,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 43,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 44,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 31,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 32,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 33,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 34,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 21,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 22,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 23,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 24,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 11,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 12,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 13,
              pn: "",
              name: "",
              time: 0,
            },
            {
              locationNum: 14,
              pn: "",
              name: "",
              time: 0,
            },
          ];
          this.$notify({
            title: "消息",
            message: "列表获取失败！" + err,
            type: "error",
          });
        });
    },
    handleClick(value) {
      if (!this.isSame) {
        this.$confirm(
          "检测到未保存的内容，是否在离开页面前保存修改？",
          "确认信息",
          {
            distinguishCancelAndClose: true,
            confirmButtonText: "返回页面",
            cancelButtonText: "放弃修改",
          }
        )
          .then(() => {
            if (/库位/.test(value)) {
              this.nowStation = this.nowStation;
              this.nowLocation = this.lastLocation;
            } else if (/工位：/.test(value)) {
              this.nowStation = this.lastStation;
              this.nowLocation = this.nowLocation;
            }
            this.ifSame();
          })
          .catch((action) => {
            this.getLocation(
              this.nowStation.replace("：", ""),
              this.nowLocation.replace("料架：", "")
            );
          });
      } else {
        this.getLocation(
          this.nowStation.replace("：", ""),
          this.nowLocation.replace("料架：", "")
        );
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    outputExcel() {
      this.$msgbox({
        title: "消息",
        message: "确认导出excel报表吗？",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = "正在导出...";
            getLocationExcel().then((res) => {
              try {
                let data = JSON.parse(this.ab2str(res.data));
                // console.log(data);
                this.$notify({
                  title: "失败",
                  message: data.msg,
                  type: "error",
                });
              } catch {
                this.download(res, "output.xlsx");
              }
            });
            done();
            instance.confirmButtonLoading = false;
          } else {
            done();
          }
        },
      })
        .then((action) => {
          // this.$notify({
          //   title: "完成",
          //   message: "导出数据成功！",
          //   type: "success",
          // });
        })
        .catch((action) => {
          if (action !== "confirm") {
            this.$notify({
              title: "消息",
              message: "已取消操作！",
              type: "info",
            });
          }
        });
    },
    download(res, fileName) {
      if (!res) {
        return;
      } else {
        let url = window.URL.createObjectURL(
          new Blob([res.data], { type: ".xlsx" })
        );
        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.setAttribute("download", fileName);
        document.body.appendChild(a);
        a.click();
        url = window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.$notify({
          title: "完成",
          message: "导出数据成功！",
          type: "success",
        });
      }
    },
    ab2str(buf) {
      let encodedString = String.fromCodePoint.apply(null, new Uint8Array(buf));
      let decodedString = decodeURIComponent(escape(encodedString)); //没有这一步中文会乱码
      return decodedString;
    },
    downloadExcel() {
      let a = document.createElement("a");
      let protocol = window.location.protocol; //协议
      let host = window.location.host; //主机
      // console.log(protocol);
      // console.log(host);
      let href =
        protocol +
        "//" +
        (/127.0.0.1/.test(host) ? "127.0.0.1:8081" : host) +
        "/download/LocationTemplate";
      // console.log(href);
      a.href = href;
      a.setAttribute("download", "Location Template.xlsx");
      a.click();
    },
    uploadExcel() {
      this.ifShowUpload = true;
    },
    closeUpload() {
      this.ifShowUpload = false;
      this.handleClick(this.nowLocation);
    },
    handleSave() {
      this.$confirm("是否要保存修改？", "确认信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "保存",
        cancelButtonText: "取消",
      })
        .then(() => {
          let data = [];
          for (let i = 0; i < 16; i++) {
            // console.log((new Date(this.locationList[i].time).getTime() - 1577808000000) / 1000);
            // console.log(JSON.stringify(this.locationList[i]));
            // console.log(JSON.stringify(this.oldLocationList[i]));
            if (
              JSON.stringify(this.locationList[i]) !==
              JSON.stringify(this.oldLocationList[i])
            ) {
              let obj = {
                LabelID: `0${this.nowLocation.replace("料架：", "")}${this.locationList[i].locationNum}`,
                Station: this.nowStation.replace("：", ""),
                PartNum: this.trimStr(this.locationList[i].pn),
                PartName: this.trimStr(this.locationList[i].name),
                Threshold_Time: this.getLocationTime(this.locationList[i].time),
              };
              // console.log(getTime("YYYY-MM-DD HH:mm:ss", this.locationList[i].time))
              // console.log(getTime("YYYY-MM-DD HH:mm:ss", obj.Threshold_Time))
              data.push(obj);
            }
          }
          let pullData = JSON.parse(JSON.stringify(data));
          updateLocation({ data: pullData })
            .then((data) => {
              // console.log(data.data);
              if (data.data.code === 0) {
                this.$alert("料架信息更新成功！", "提示", {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.ifSame();
                  },
                });
              } else {
                this.$alert(data.data.msg, "提示", {
                  dangerouslyUseHTMLString: true,
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.ifSame();
                  },
                });
              }
              this.getLocation(
                this.nowStation.replace("：", ""),
                this.nowLocation.replace("料架：", "")
              );
            })
            .catch((err) => {
              console.log(err);
              this.$alert(err, "提示", {
                dangerouslyUseHTMLString: true,
                confirmButtonText: "确定",
                callback: (action) => {
                  this.ifSame();
                },
              });
              this.getLocation(
                this.nowStation.replace("：", ""),
                this.nowLocation.replace("料架：", "")
              );
            });
        })
        .catch((action) => {
          // console.log(action);
          this.$message({
            type: "info",
            message: "操作已取消",
          });
        });
    },
    ifSame() {
      //       locationNum: (...)
      // name: (...)
      // pn: (...)
      // time: (...)
      let result = true;
      for (let i = 0; i < 16; i++) {
        if (
          this.locationList[i].name !== this.oldLocationList[i].name ||
          this.locationList[i].pn !== this.oldLocationList[i].pn ||
          new Date(this.locationList[i].time).getTime() !==
          new Date(this.oldLocationList[i].time).getTime()
        ) {
          result = false;
          break;
        }
      }
      // console.log(result)
      this.isSame = result;
    },
    trimStr(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    getLocationTime(dateTime) {
      let date = new Date(dateTime);
      // console.log(date.getTime())
      let Hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      // console.log(Hours, minutes, seconds);
      let newDateTime = new Date(`2000-01-01 ${Hours}:${minutes}:${seconds}`);
      newDateTime.setHours(Hours + 8);
      // console.log(newDateTime);
      return newDateTime.getTime() / 1000;
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        that.fullHeight = window.fullHeight;
      })();
    };
    this.height = this.fullHeight - 170;
    this.style = { height: this.height + "px" };
    this.getLocation(
      this.nowStation.replace("：", ""),
      this.nowLocation.replace("料架：", "")
    );
  },
};
</script>

<style lang="less" scoped>
.btnBox {
  width: 100%;

  .shiftbtn {
    width: 40%;
    float: left;
  }

  .searchbox {
    width: 60%;
    float: right;
  }
}

.bigBox {
  .chickLocation {
    box-sizing: border-box;
    margin: 20px auto;
    padding: 0 20px;
    width: 1460px;
    height: 32px;

    .el-select--small {
      width: 150px;
      margin-right: 30px;
    }

    .saveBtn,
    .downloadBtn,
    .outputBtn {
      display: inline-block;
      width: 110px;
      margin-right: 20px;
    }

    .uploadBtn {
      display: inline-block;
      width: 90px;
      margin-right: 20px;
    }
  }

  .locationBox {
    margin: 20px auto;
    width: 1460px;
    overflow-y: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .location {
      padding: 10px;
      box-sizing: border-box;
      margin: 10px;
      border-radius: 4px;
      width: 340px;
      height: 160px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      background-color: white;

      p,
      .pnbox,
      .namebox,
      .timebox {
        margin-bottom: 8px;

        .leftBox {
          display: inline-block;
          background-color: #f5f7fa;
          color: #909399;
          vertical-align: middle;
          position: relative;
          border: 1px solid #dcdfe6;
          border-right: 0px solid #dcdfe6;
          border-radius: 4px 0 0 4px;
          padding: 0 20px;
          width: 52px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          white-space: nowrap;
        }

        .el-date-editor--time {
          width: 227px;
          border-radius: 0 4px 4px 0;

          // top: 1px;
          /deep/.el-input__inner {
            border-radius: 0 4px 4px 0;
          }
        }
      }

      .btnBox {
        display: block;
        margin: 0 auto;
        width: 59.34px;
      }
    }
  }
}

@media (max-width: 1750px) {
  .bigBox {
    .chickLocation {
      box-sizing: border-box;
      margin: 20px auto;
      width: 1100px;
      height: 32px;
      padding: 0 20px;

      .el-select--small {
        width: 150px;
        margin-right: 30px;
      }

      .saveBtn,
      .downloadBtn,
      .outputBtn {
        display: inline-block;
        width: 110px;
        margin-right: 20px;
      }

      .uploadBtn {
        display: inline-block;
        width: 90px;
        margin-right: 20px;
      }
    }

    .locationBox {
      margin: 20px auto;
      width: 1100px;
      overflow-y: auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .location {
        padding: 10px;
        box-sizing: border-box;
        margin: 10px;
        border-radius: 4px;
        width: 240px;
        height: 160px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        background-color: white;

        p,
        .pnbox,
        .namebox,
        .timebox {
          margin-bottom: 8px;

          .leftBox {
            display: inline-block;
            background-color: #f5f7fa;
            color: #909399;
            vertical-align: middle;
            position: relative;
            border: 1px solid #dcdfe6;
            border-right: 0px solid #dcdfe6;
            border-radius: 4px 0 0 4px;
            padding: 0 20px;
            width: 52px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            white-space: nowrap;
          }

          .el-date-editor--time {
            width: 127px;
            border-radius: 0 4px 4px 0;

            // top: 1px;
            /deep/.el-input__inner {
              border-radius: 0 4px 4px 0;
            }
          }
        }

        .btnBox {
          display: block;
          margin: 0 auto;
          width: 59.34px;
        }
      }
    }
  }
}
</style>
