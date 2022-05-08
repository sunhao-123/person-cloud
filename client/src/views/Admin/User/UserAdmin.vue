<template>
  <div class="tableboxtop50">
    <div class="searchBar">
      <div class="filterBox">
        <el-input v-model="search" size="small" placeholder="输入用户名筛选" />
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="
        userList.filter(
          (data) =>
            !search ||
            data.username.toLowerCase().includes(search.toLowerCase())
        )
      "
      :height="height"
      style="width: 100%"
    >
      <el-table-column label="用户名" width="500" prop="username">
        <template slot-scope="scope">
          <span v-if="!scope.row.edit || scope.row.UID !== 0">{{
            scope.row.username
          }}</span>
          <span v-if="scope.row.edit && scope.row.UID === 0">用户名：</span>
          <el-input
            v-if="scope.row.edit && scope.row.UID === 0"
            v-model="scope.row.username"
            size="small"
            style="width: 36%"
            placeholder="请输入用户名"
          />
          <span v-if="scope.row.edit && scope.row.UID === 0"
            >&nbsp;&nbsp;&nbsp;&nbsp;密码：</span
          >
          <el-input
            v-if="scope.row.edit && scope.row.UID === 0"
            v-model="scope.row.password"
            size="small"
            style="width: 36%"
            placeholder="请输入密码"
          />
        </template>
      </el-table-column>
      <el-table-column label="管理员" width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isAdmin"
            :disabled="!scope.row.edit"
            @change="adminChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column :label="'\u00a0\u00a0\u00a0\u00a0\u00a0员工技能匹配'">
        <el-table-column label="工位1" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.station1"
              :disabled="!scope.row.edit || scope.row.isAdmin"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="工位2" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.station2"
              :disabled="!scope.row.edit || scope.row.isAdmin"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="工位3" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.station3"
              :disabled="!scope.row.edit || scope.row.isAdmin"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" width="215">
        <template slot-scope="scope">
          <el-button
            size="small"
            v-if="!scope.row.edit"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            @click="handleCancel(scope.$index, scope.row)"
            v-if="scope.row.edit && scope.row.UID !== 0"
            >取消</el-button
          >
          <el-button
            size="small"
            type="success"
            @click="handleSave(scope.$index, scope.row)"
            v-if="scope.row.edit"
            >保存</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="deleteOne(scope.$index, scope.row)"
            v-if="scope.row.edit && scope.row.UID !== 0"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column>
        <!-- eslint-disable-next-line -->
        <template slot="header" slot-scope="scope">
          <div class="btnBox">
            <el-button
              type="primary"
              plain
              size="small"
              @click="adduser"
              v-if="!addflag"
              >增加用户</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              @click="canceladd"
              v-if="addflag"
              >取消增加</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getUserList, deleteUser, updateUser } from "../../../api";

export default {
  name: "UserAdmin",
  components: {},
  data() {
    return {
      userList: [],
      search: "",
      addflag: false,
      loading: false,
      fullHeight: document.documentElement.clientHeight,
      height: document.documentElement.clientHeight - 152,
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
      this.height = this.fullHeight - 152;
    },
  },
  methods: {
    adminChange(row) {
      // console.log(row);
      if (row.isAdmin) {
        row.station1 = true;
        row.station2 = true;
        row.station3 = true;
      }
    },
    handleSave(index, row) {
      // console.log(row);
      if (row.username === "") {
        this.$notify({
          title: "提示",
          message: "请输入用户名！",
          type: "warning",
        });
      } else if (row.password === "" && row.UID === 0) {
        this.$notify({
          title: "提示",
          message: "请输入密码！",
          type: "warning",
        });
      } else if (!row.station1 && !row.station2 && !row.station3) {
        this.$notify({
          title: "提示",
          message: "请至少赋予一个用户权限！",
          type: "warning",
        });
      } else {
        updateUser(row)
          .then((res) => {
            if (res.data.code === 0) {
              this.getUserList();
              this.$notify({
                title: "成功",
                message: "修改数据成功！",
                type: "success",
              });
            } else {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error",
              });
            }
          })
          .catch(() => {
            this.$notify({
              title: "失败",
              message: res.data.msg,
              type: "error",
            });
          });
      }
    },
    deleteOne(index, row) {
      this.$confirm("即将删除该用户，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteUser(row.UID, row.username)
            .then((res) => {
              let code = res.data.code;
              if (code === 0) {
                this.getUserList();
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                });
              } else {
                this.$notify({
                  title: "警告",
                  message: res.data.msg,
                  type: "warning",
                });
              }
            })
            .catch(() => {
              this.$notify({
                title: "失败",
                message: res.data.msg,
                type: "error",
              });
            });
        })
        .catch(() => {});
    },
    handleEdit(index, row) {
      row.edit = !row.edit;
    },
    handleCancel(index, row) {
      row.edit = !row.edit;
      this.getUserList();
    },
    getUserList() {
      this.loading = true;
      getUserList().then((res) => {
        this.addflag = false;
        this.userList = JSON.parse(JSON.stringify(res.data.data));
        // console.log(this.userList);
        this.loading = false;
      });
    },
    adduser() {
      this.addflag = true;
      // console.log(this.addflag)
      this.userList.push({
        UID: 0,
        edit: true,
        isAdmin: false,
        station1: false,
        station2: false,
        station3: false,
        password: "",
        username: "",
      });
    },
    canceladd() {
      this.addflag = false;
      this.userList = this.userList.filter((e) => {
        return e.UID !== 0;
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
    this.height = this.fullHeight - 152;
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.btnBox {
  width: 100%;
}
.searchBar {
  padding-left: 40px;
  margin-top: 40px;
  margin-bottom: 20px;
  .filterBox {
    width: 300px;
  }
}
</style>
