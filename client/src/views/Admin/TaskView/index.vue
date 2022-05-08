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
      <el-table-column label="XML文件唯一标识" width="90">
        <template slot-scope="scope">
          {{ scope.row.XID }}
        </template>
      </el-table-column>
      <el-table-column label="工厂代码" width="90">
        <template slot-scope="scope">
          {{ scope.row.Plant }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" width="120">
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column label="Family" width="90">
        <template slot-scope="scope">
          {{ scope.row.Family }}
        </template>
      </el-table-column>
      <el-table-column label="VIN" width="100">
        <template slot-scope="scope">
          {{ scope.row.VIN }}
        </template>
      </el-table-column>
      <el-table-column label="Sequence" width="110">
        <template slot-scope="scope">
          {{ scope.row.PlanCurSeq }}
        </template>
      </el-table-column>
      <el-table-column label="CarSet" width="120">
        <template slot-scope="scope">
          {{ scope.row.CarSet }}
        </template>
      </el-table-column>
      <el-table-column label="blgroup" width="110">
        <template slot-scope="scope">
          {{ scope.row.Part_blgroup }}
        </template>
      </el-table-column>
      <el-table-column label="BOM清单" width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p
              v-html="formatBoms(scope.row.Part_LearId, scope.row.Part_Qty)"
            ></p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium"
                >查看BOM清单（{{ getcount(scope.row.Part_Qty) }}件）</el-tag
              >
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="170">
        <template slot-scope="scope">
          {{ formatTime(scope.row.creatTime) }}
        </template>
      </el-table-column>
      <el-table-column label="是否完成" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isFinish ? 'success' : 'warning'"
            disable-transitions
            size="medium"
            >{{ scope.row.isFinish ? "已完成" : "未完成" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="完成时间" min-width="170">
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
import { getTaskList, getTaskCount, getPnName } from "../../../api";
import getTime from "../../../assets/js/gettime.js";

export default {
  name: "TaskView",
  data() {
    return {
      PnNameList: {},
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
      this.getTaskList(1, this.lastsearchDate, this.lastStation);
      clearInterval(this.schedule);
      this.schedule = null;
      this.schedule = setInterval(() => {
        this.getTaskList(1, this.lastsearchDate, this.lastStation);
      }, 30000);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getTaskList1(val, this.lastsearchDate, this.lastStation);
      clearInterval(this.schedule);
      this.schedule = null;
      this.schedule = setInterval(() => {
        this.getTaskList1(val, this.lastsearchDate, this.lastStation);
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
    formatBoms(LearId, Qty) {
      let html = "";
      let LearIds = LearId.split(",");
      let Qtys = Qty.split(",");
      LearIds.forEach((item, i) => {
        html += `<p>${i + 1 < 10 ? "0" + (i + 1) : i + 1}. &nbsp;${item} * ${
          Qtys[i]
        }个<span style="padding-left:20px;float: right;width: 180px;">${
          this.PnNameList[item] ? this.PnNameList[item] : ""
        }</span></p>`;
      });
      return html;
    },
    getcount(str) {
      let nums = str.split(",");
      let count = 0;
      nums.forEach((item) => {
        count += item * 1;
      });
      return count;
    },
    getTime(str) {
      return getTime("YYYY-MM-DD hh:mm:ss", str);
    },
    indexMethod(index) {
      return index + 1 + (this.page - 1) * 50;
    },
    getTaskList1(page, dateArr, station) {
      this.loading = true;
      getTaskList({ from: (page - 1) * 50, dateArr, station }).then((res) => {
        this.list = res.data.data;
        this.loading = false;
      });
    },
    getTaskList(page, dateArr, station) {
      this.loading = true;
      getTaskCount({ dateArr, station }).then((data) => {
        if (data.data.code === 0) {
          this.alldata = data.data.num;
          getTaskList({ from: (page - 1) * 50, dateArr, station }).then(
            (res) => {
              this.list = res.data.data;
              // console.log(this.list);
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
    getPnName()
      .then((data) => {
        if (data.data.code === 0) {
          this.PnNameList = data.data.data;
        }
        this.getTaskList(1, this.searchDate, this.nowStation);
      })
      .catch((err) => {
        console.log(err);
        this.getTaskList(1, this.searchDate, this.nowStation);
      });

    clearInterval(this.schedule);
    this.schedule = null;
    this.schedule = setInterval(() => {
      this.getTaskList(1, this.searchDate, this.nowStation);
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
