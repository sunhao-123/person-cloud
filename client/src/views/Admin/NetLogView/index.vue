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
          placeholder="输入接口路由筛选"
        />
      </div>
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :data="
        list.filter(
          (data) =>
            !search || data.url.toLowerCase().includes(search.toLowerCase())
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
      <el-table-column label="访问时间" width="200">
        <template slot-scope="scope">
          {{ formatTime(scope.row.time) }}
        </template>
      </el-table-column>
      <el-table-column label="协议" width="90">
        <template slot-scope="scope">
          <p
            style="font-weight: bold"
            v-html="formatText(scope.row.method)"
          ></p>
        </template>
      </el-table-column>
      <el-table-column label="HTTP版本" width="100">
        <template slot-scope="scope">
          {{ scope.row.httpVersion }}
        </template>
      </el-table-column>
      <el-table-column label="访问接口" width="300">
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column label="访问数据" width="120">
        <template slot-scope="scope">
          {{ scope.row.data }}
        </template>
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.data }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">查看数据</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="客户端IP" width="140">
        <template slot-scope="scope">
          {{ scope.row.clientIP }}
        </template>
      </el-table-column>
      <el-table-column label="客户端软件" width="210">
        <template slot-scope="scope">
          {{ scope.row.clientUa }}
        </template>
      </el-table-column>
      <el-table-column label="客户端OS" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.clientSystem }}
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
    >
    </el-pagination>
  </div>
</template>

<script>
import { getNetLogList, getNetLogCount } from "../../../api";
import getTime from "../../../assets/js/gettime.js";

export default {
  name: "NetLogView",
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
      this.getNetLogList(1, this.lastsearchDate);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getNetLogList1(val, this.lastsearchDate);
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
        .replace("GET", '<span style="color: #4AB793">GET</span>')
        .replace("POST", '<span style="color: #C37933">POST</span>')
        .replace("OPTIONS", '<span style="color: #187FDE">OPTIONS</span>');
    },
    getTime(str) {
      return getTime("YYYY-MM-DD hh:mm:ss", str);
    },
    indexMethod(index) {
      return index + 1 + (this.page - 1) * 50;
    },
    getNetLogList1(page, dateArr) {
      this.loading = true;
      getNetLogList({ from: (page - 1) * 50, dateArr }).then((res) => {
        this.list = res.data.data;
        this.loading = false;
      });
    },
    getNetLogList(page, dateArr) {
      this.loading = true;
      getNetLogCount({ dateArr }).then((data) => {
        if (data.data.code === 0) {
          this.alldata = data.data.num;
          getNetLogList({ from: (page - 1) * 50, dateArr }).then((res) => {
            this.list = res.data.data
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
    this.getNetLogList(1, this.searchDate);
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
