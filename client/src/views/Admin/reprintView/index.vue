<template>
  <div class="tableboxtop50">
    <div class="searchBar">
      <el-date-picker
        v-model="searchDate"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="timestamp"
        size="small"
      >
      </el-date-picker>
      <el-select size="small" v-model="nowStation" placeholder="请选择">
        <el-option
          v-for="item in station"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button
        type="primary"
        round
        size="small"
        class="searchBtn"
        @click="handleSearch"
        >搜索</el-button
      >
      <div class="filterBox">
        <el-input v-model="search" size="small" placeholder="输入订单号筛选" />
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="
        list.filter(
          (data) =>
            !search ||
            data.orderNum.toLowerCase().includes(search.toLowerCase())
        )
      "
      :height="height"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
        width="50"
      >
      </el-table-column>
      <el-table-column label="补打订单号" width="200">
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210">
        <template slot-scope="scope">
          {{ formatTime(scope.row.creatTime) }}
        </template>
      </el-table-column>
      <el-table-column label="是否重新拣选" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.needRestart ? null : 'info'"
            disable-transitions
            >{{ scope.row.needRestart ? "重新拣选" : "无需拣选" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="是否完成" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isFinish ? 'success' : 'warning'"
            disable-transitions
            >{{ scope.row.isFinish ? "已完成" : "未完成" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="完成时间" min-width="210">
        <template slot-scope="scope">
          {{ formatTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="50"
      @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper"
      :total="alldata"
      class="page"
      :current-page="page"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getReprintList, getReprintListCount } from "../../../api";
import getTime from "../../../assets/js/gettime.js";

export default {
  name: "LogView",
  data() {
    return {
      nowStation: "工位：1",
      lastStation: "工位：1",
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
      searchDate: [new Date().getTime(), new Date().getTime()],
      lastsearchDate: [new Date().getTime(), new Date().getTime()],
      alldata: 5000,
      page: 1,
      list: [],
      search: "",
      fullHeight: document.documentElement.clientHeight,
      height: document.documentElement.clientHeight - 195,
      loading: false,
      schedule: null,
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
      this.height = this.fullHeight - 195;
    },
    page(val) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
    },
  },
  methods: {
    handleSearch() {
      this.lastsearchDate = this.searchDate;
      this.lastStation = this.nowStation;
      this.page = 1;
      this.getReprintList(1, this.lastsearchDate, this.lastStation);
      clearInterval(this.schedule);
      this.schedule = null;
      this.schedule = setInterval(() => {
        this.getReprintList(1, this.lastsearchDate, this.lastStation);
      }, 30000);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getReprintList1(val, this.lastsearchDate, this.lastStation);
      clearInterval(this.schedule);
      this.schedule = null;
      this.schedule = setInterval(() => {
        this.getReprintList1(val, this.lastsearchDate, this.lastStation);
      }, 30000);
    },
    formatTime(str) {
      let date = new Date(str).getTime();
      let datestr = "";
      if (date > 0) {
        datestr = getTime("YYYY-MM-DD HH:mm:ss", date - 8 * 3600 * 1000);
      }
      return datestr;
    },
    formatText(str) {
      return str
        .replace("【INFO】", '<span style="color: #05C462">【INFO】</span>')
        .replace("【ERROR】", '<span style="color: red">【ERROR】</span>')
        .replace(
          "【WARNING】",
          '<span style="color: orange">【WARNING】</span>'
        )
        .replace("【UNKNOWN】", '<span style="color: gray">【UNKNOWN】</span>');
    },
    getTime(str) {
      return getTime("YYYY-MM-DD hh:mm:ss", str);
    },
    indexMethod(index) {
      return index + 1 + (this.page - 1) * 50;
    },
    getReprintList1(page, dateArr, station) {
      this.loading = true;
      getReprintList({ from: (page - 1) * 50, dateArr, station }).then(
        (res) => {
          this.list = res.data.data;
          this.loading = false;
        }
      );
    },
    getReprintList(page, dateArr, station) {
      this.loading = true;
      getReprintListCount({ dateArr, station }).then((data) => {
        if (data.data.code === 0) {
          this.alldata = data.data.num;
          getReprintList({ from: (page - 1) * 50, dateArr, station }).then(
            (res) => {
              this.list = res.data.data;
              // console.log(res.data);
              this.loading = false;
            }
          );
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
    this.height = this.fullHeight - 195;
    this.getReprintList(1, this.searchDate, this.nowStation);
    clearInterval(this.schedule);
    this.schedule = null;
    this.schedule = setInterval(() => {
      this.getReprintList(1, this.searchDate, this.nowStation);
    }, 30000);
  },
  /* 离开页面销毁定时器 */
  beforeRouteLeave(to, form, next) {
    clearInterval(this.schedule);
    this.schedule = null;
    next();
  },
};
</script>

<style lang="less" scoped>
.page {
  margin-top: 10px;
}
.searchBar {
  padding-left: 40px;
  margin-top: 40px;
  margin-bottom: 20px;
  .searchBtn {
    margin-left: 20px;
  }
  .filterBox {
    margin-right: 40px;
    width: 300px;
    float: right;
  }
  .el-select--small {
    width: 150px;
    margin-left: 20px;
  }
}
</style>
