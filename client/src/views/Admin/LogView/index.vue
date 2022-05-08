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
      <el-button
        type="primary"
        round
        size="small"
        class="searchBtn"
        @click="handleSearch"
        >搜索</el-button
      >
      <div class="filterBox">
        <el-input
          v-model="search"
          size="small"
          placeholder="输入日志内容搜索"
        />
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="
        list.filter(
          (data) =>
            !search || data.cont.toLowerCase().includes(search.toLowerCase())
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
      <el-table-column label="日志" width="750">
        <template slot-scope="scope">
          <p v-html="formatText(scope.row.cont)"></p>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="200">
        <template slot-scope="scope">
          {{ formatTime(scope.row.creatTime) }}
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
import { getLogList, getLogCount } from "../../../api";
import getTime from "../../../assets/js/gettime.js";

export default {
  name: "LogView",
  data() {
    return {
      searchDate: [new Date().getTime(), new Date().getTime()],
      lastsearchDate: [new Date().getTime(), new Date().getTime()],
      alldata: 5000,
      page: 1,
      list: [],
      search: "",
      fullHeight: document.documentElement.clientHeight,
      height: document.documentElement.clientHeight - 195,
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
      this.height = this.fullHeight - 195;
    },
    page(val) {
      this.$refs.table.bodyWrapper.scrollTop = 0;
    },
  },
  methods: {
    handleSearch() {
      this.lastsearchDate = this.searchDate;
      this.page = 1;
      this.getLogList(1, this.lastsearchDate);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getLogList1(val, this.lastsearchDate);
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
    getLogList1(page, dateArr) {
      this.loading = true;
      getLogList({ from: (page - 1) * 50, dateArr }).then((res) => {
        this.list = res.data.data;
        this.loading = false;
      });
    },
    getLogList(page, dateArr) {
      this.loading = true;
      getLogCount({ dateArr }).then((data) => {
        if (data.data.code === 0) {
          this.alldata = data.data.num;
          getLogList({ from: (page - 1) * 50, dateArr }).then((res) => {
            this.list = res.data.data;
            this.loading = false;
          });
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
    this.getLogList(1, this.searchDate);
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
}
</style>
