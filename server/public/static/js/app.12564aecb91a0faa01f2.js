webpackJsonp([1],{"12Xs":function(e,t,a){e.exports=a.p+"static/img/xlsx.85ef4c1.png"},"70Sk":function(e,t){},"7Otq":function(e,t,a){e.exports=a.p+"static/img/logo.b5193a9.png"},D7lP:function(e,t){},LaAj:function(e,t){},NHnr:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=a("7+uW"),n={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var r=a("VU/8")({name:"App"},n,!1,function(e){a("D7lP")},null,null).exports,o=a("/ocq"),i={name:"index",data:function(){return{dialogFormVisible:!1,form:{username:"",password:""},formLabelWidth:"120px"}},methods:{signIn:function(){var e=this;this.dialogFormVisible=!1,this.$http.post("/user/validate",this.form).then(function(t){0===t.data.flag?e.$message.error(t.data.msg):(e.$message.success(t.data.msg),sessionStorage.setItem("uid",t.data.uid),sessionStorage.setItem("username",t.data.username),e.$router.push("tab-list"))}).catch(function(e){console.log(e)})}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"index"},[a("div",{staticClass:"title"},[e._v("\n    在线网盘系统\n  ")]),e._v(" "),a("div",{staticClass:"label"},[e._v("\n    Cloud Driver\n  ")]),e._v(" "),a("div",{staticClass:"btn"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogFormVisible=!0}}},[e._v("登录")])],1),e._v(" "),a("el-dialog",{attrs:{title:"登录",visible:e.dialogFormVisible,width:"400px"},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{attrs:{model:e.form}},[a("el-form-item",{attrs:{label:"用户名","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off"},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"密码","label-width":e.formLabelWidth}},[a("el-input",{attrs:{autocomplete:"off",type:"password"},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.signIn}},[e._v("登 录")])],1)],1)],1)},staticRenderFns:[]};var u=a("VU/8")(i,l,!1,function(e){a("70Sk")},"data-v-2e185278",null).exports,c={name:"base-header",data:function(){return{username:sessionStorage.getItem("username")}},methods:{signOut:function(){this.$router.push({path:"/"}),sessionStorage.clear()}}},d={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"header"},[this._m(0),this._v(" "),t("div",{staticClass:"user"},[this._v("\n    用户: "+this._s(this.username)+"  "),t("a",{attrs:{href:"#"},on:{click:this.signOut}},[this._v("退出")])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"title"},[t("img",{staticStyle:{height:"65px",margin:"0px 7px -9px 0"},attrs:{src:a("7Otq"),height:"65",alt:"logo"}}),this._v("\n    孙同学的网盘"),t("span",{staticClass:"label"},[this._v("    Classmate-Sun’s Cloud")])])}]};var m={name:"index",data:function(){return{date:(new Date).getFullYear()}}},f={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"footer"},[this._v("\n  Copyright © "+this._s(this.date)+" "),t("a",{attrs:{href:"mailto:suntongxue@sun0623.top"}},[this._v("Classmate-Sun")]),this._v(" 版权所有\n")])},staticRenderFns:[]};var p={data:function(){return{userInfo:{uid:sessionStorage.getItem("uid")}}},methods:{dealSuccess:function(){this.$message.success("上传文件成功!")},dealError:function(){this.$message.error("上传文件失败,请重新上传!")}}},h={render:function(){var e=this.$createElement,t=this._self._c||e;return t("el-upload",{attrs:{drag:"",multiple:"",action:"http://accurate.uicp.net:8081/file/add",data:this.userInfo,"on-success":this.dealSuccess,"on-error":this.dealError}},[t("i",{staticClass:"el-icon-upload"}),this._v(" "),t("div",{staticClass:"el-upload__text"},[this._v("将文件拖到此处，或"),t("em",[this._v("点击上传")])])])},staticRenderFns:[]};var v={data:function(){return{tableData:[],listType:"平铺"}},methods:{handleDelete:function(e,t){var a=this;this.$http.delete("/file/delete/"+t.hash_name+"/"+t.id).then(function(e){a.$message.success(e.data.msg),a.refreshFileList()}).catch(function(e){console.log("Error=>",e)})},handleShare:function(e,t){var a="http://accurate.uicp.net:8081/file/download/"+t.id+"/"+t.hash_name;this.$alert('<p style="word-wrap: break-word; word-break: break-all;">'+a+"</p>","复制以下链接分享给好友哦~",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",callback:function(e){}})},handleDownload:function(){var e=this;setTimeout(function(){e.refreshFileList()},1e3)},refreshFileList:function(){this.getFileList()},getFileList:function(){var e=this,t={uid:sessionStorage.getItem("uid")};this.$http.post("/file/list",t).then(function(t){0===t.data.code?e.$message.error(t.data.msg):(e.tableData=t.data,console.log(e.tableData))}).catch(function(e){console.log(e)})},getFile:function(e){return"http://accurate.uicp.net:8081/file/download/"+e.id+"/"+e.hash_name},dealSize:function(e,t){return(e.size/1024).toFixed(2)+"kb"},dealTime:function(e,t){return this.formatTime(e.upload_time)},formatTime:function(e){var t=new Date(e);return t.getFullYear()+"-"+(t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"-"+(t.getDate()<10?"0"+t.getDate():t.getDate())+" "+(t.getHours()<10?"0"+t.getHours():t.getHours())+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes())+":"+(t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds())}},mounted:function(){this.getFileList()}},b={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("el-radio-group",{model:{value:e.listType,callback:function(t){e.listType=t},expression:"listType"}},[s("el-radio",{attrs:{label:"列表"}}),e._v(" "),s("el-radio",{attrs:{label:"平铺"}})],1),e._v(" "),"列表"===e.listType?s("el-table",{staticStyle:{width:"100%"},attrs:{data:e.tableData,"cell-style":{"text-align":"center"},"header-cell-style":{"text-align":"center"}}},[s("el-table-column",{attrs:{type:"index"}}),e._v(" "),s("el-table-column",{attrs:{prop:"file_name",label:"文件名",width:"180px"}}),e._v(" "),s("el-table-column",{attrs:{prop:"size",label:"文件大小",width:"180px",formatter:e.dealSize}}),e._v(" "),s("el-table-column",{attrs:{prop:"upload_time",label:"上传时间",width:"180px",formatter:e.dealTime}}),e._v(" "),s("el-table-column",{attrs:{prop:"download",label:"下载次数",width:"180px"}}),e._v(" "),s("el-table-column",{attrs:{prop:"type",label:"类型",width:"180px"}}),e._v(" "),s("el-table-column",{attrs:{label:"操作","min-width":"200px"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("a",{attrs:{href:e.getFile(t.row),download:t.row.file_name}},[s("el-button",{attrs:{size:"mini",type:"success"},on:{click:e.handleDownload}},[e._v("下载")])],1),e._v(" "),s("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(a){return e.handleShare(t.$index,t.row)}}},[e._v("分享")]),e._v(" "),s("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1):e._e(),e._v(" "),"平铺"===e.listType?s("div",{staticClass:"Listpp"},e._l(e.tableData,function(t){return s("div",{key:t.id,staticClass:"fileListpp"},[s("div",{staticClass:"fileIcon"},[s("img",{attrs:{width:"256",height:"256",src:a("tsha")("./"+t.type.replace(/./,"")+".png"),alt:t.file_name}})]),e._v(" "),s("p",{staticClass:"fileName"},[e._v(e._s(t.file_name))])])}),0):e._e()],1)},staticRenderFns:[]};var g={data:function(){var e=this;return{ruleForm:{oldPass:"",newPass:"",checkNewPass:""},rules:{oldPass:[{validator:function(t,a,s){""===a?s(new Error("请输入密码")):(""!==e.ruleForm.oldPass&&e.$refs.ruleForm.validateField("newPass"),s())},trigger:"blur"}],newPass:[{validator:function(t,a,s){""===a?s(new Error("请输入新密码")):a===e.ruleForm.oldPass?s(new Error("新旧密码不能相同!")):s()},trigger:"blur"}],checkNewPass:[{validator:function(t,a,s){""===a?s(new Error("请再次输入密码")):a!==e.ruleForm.newPass?s(new Error("两次输入密码不一致!!")):s()},trigger:"blur"}]}}},methods:{submitForm:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;var a={oldPassword:t.ruleForm.oldPass,newPassword:t.ruleForm.newPass};t.$http.put("/user/update/"+sessionStorage.uid,a).then(function(e){t.$message.success("修改密码成功!请重新登录"),sessionStorage.clear(),setTimeout(function(){t.$router.push({path:"/"})},1e3)}).catch(function(e){console.log("Error=>",e)})})},resetForm:function(e){this.$refs[e].resetFields()}}},_={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-form",{ref:"ruleForm",staticClass:"change-password",attrs:{model:e.ruleForm,"status-icon":"",rules:e.rules,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"原密码",prop:"oldPass"}},[a("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.ruleForm.oldPass,callback:function(t){e.$set(e.ruleForm,"oldPass",t)},expression:"ruleForm.oldPass"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"新密码",prop:"newPass"}},[a("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.ruleForm.newPass,callback:function(t){e.$set(e.ruleForm,"newPass",t)},expression:"ruleForm.newPass"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"确认新密码",prop:"checkNewPass"}},[a("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.ruleForm.checkNewPass,callback:function(t){e.$set(e.ruleForm,"checkNewPass",t)},expression:"ruleForm.checkNewPass"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v("提交")]),e._v(" "),a("el-button",{on:{click:function(t){return e.resetForm("ruleForm")}}},[e._v("重置")])],1)],1)],1)},staticRenderFns:[]};var w={name:"show",components:{BaseHeader:a("VU/8")(c,d,!1,function(e){a("i+Qd")},"data-v-2b07b7e8",null).exports,BaseFooter:a("VU/8")(m,f,!1,function(e){a("LaAj")},"data-v-4c6b7930",null).exports,UploadFile:a("VU/8")(p,h,!1,function(e){a("OzS8")},"data-v-2f6dcbae",null).exports,FileList:a("VU/8")(v,b,!1,function(e){a("fsXu")},"data-v-314ae745",null).exports,userSet:a("VU/8")(g,_,!1,function(e){a("bGun")},"data-v-617d2893",null).exports},data:function(){return{tabActivedName:"second",componentList:[{tabName:"first",compoName:"upload-file",tabLabel:"上传文件"},{tabName:"second",compoName:"file-list",tabLabel:"文件列表"},{tabName:"third",compoName:"user-set",tabLabel:"用户设置"}]}},methods:{handleClick:function(e,t){console.log(e,t)}}},F={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"show"},[a("base-header"),e._v(" "),a("el-tabs",{staticClass:"tab",on:{"tab-click":e.handleClick},model:{value:e.tabActivedName,callback:function(t){e.tabActivedName=t},expression:"tabActivedName"}},e._l(e.componentList,function(t,s){return a("el-tab-pane",{key:s,attrs:{label:t.tabLabel,name:t.tabName}},[e.tabActivedName===t.tabName?a(t.compoName,{tag:"component"}):e._e()],1)}),1),e._v(" "),a("base-footer")],1)},staticRenderFns:[]};var x=a("VU/8")(w,F,!1,function(e){a("PTov")},"data-v-74306d84",null).exports;s.default.use(o.a);var k=new o.a({routes:[{path:"/",name:"index",component:u},{path:"/tab-list",name:"tab-list",component:x}]});k.beforeEach(function(e,t,a){if("tab-list"===e.name){if(!sessionStorage.username)return window.alert("您的登录信息无效或过期，请重新登录"),window.location.replace("/");a()}else a()});var y=k,$=a("//Fk"),P=a.n($),S=a("Dd8w"),C=a.n(S),L=a("mtWM"),N=a.n(L).a.create();N.defaults.baseURL="http://accurate.uicp.net:8081/",N.defaults.timeout=5e3,N.formurl=function(e,t,a){return N.post(e,t,C()({headers:{"Content-Type":"application/x-www-form-urlencoded"}},a))},N.interceptors.request.use(function(e){return console.log(e),e},function(e){return P.a.reject(e)}),N.interceptors.response.use(function(e){if(200===e.status)return P.a.resolve(e)},function(e){return P.a.reject(e)});var E=N,D=a("zL8q"),T=a.n(D);a("tvR6");s.default.prototype.$http=E,s.default.config.productionTip=!1,s.default.use(T.a),new s.default({el:"#app",router:y,components:{App:r},template:"<App/>"})},OzS8:function(e,t){},PTov:function(e,t){},bGun:function(e,t){},fsXu:function(e,t){},"i+Qd":function(e,t){},qld3:function(e,t,a){e.exports=a.p+"static/img/xls.d11139d.png"},rkla:function(e,t,a){e.exports=a.p+"static/img/iso.ec1ede3.png"},tsha:function(e,t,a){var s={"./iso.png":"rkla","./png.png":"vojF","./xls.png":"qld3","./xlsx.png":"12Xs"};function n(e){return a(r(e))}function r(e){var t=s[e];if(!(t+1))throw new Error("Cannot find module '"+e+"'.");return t}n.keys=function(){return Object.keys(s)},n.resolve=r,e.exports=n,n.id="tsha"},tvR6:function(e,t){},vojF:function(e,t,a){e.exports=a.p+"static/img/png.063f86d.png"}},["NHnr"]);
//# sourceMappingURL=app.12564aecb91a0faa01f2.js.map