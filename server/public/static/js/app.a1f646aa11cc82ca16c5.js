webpackJsonp([1],{"+4Fl":function(e,t){},"/gRd":function(e,t){},"4vLI":function(e,t){},"6X/o":function(e,t){},"7Otq":function(e,t,i){e.exports=i.p+"static/img/logo.b5193a9.png"},AV7G:function(e,t){},NHnr:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=i("7+uW"),s={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var l=i("VU/8")({name:"App"},s,!1,function(e){i("AV7G")},null,null).exports,n=i("/ocq"),a={name:"index",data:function(){return{dialogFormVisible:!1,form:{username:"",password:""},formLabelWidth:"120px",hostUrl:""}},methods:{signIn:function(){var e=this;this.dialogFormVisible=!1,this.$http.post(this.hostUrl+"/user/validate",this.form).then(function(t){0===t.data.flag?e.$message.error(t.data.msg):(e.$message.success(t.data.msg),sessionStorage.setItem("uid",t.data.uid),sessionStorage.setItem("username",t.data.username),e.$router.push("tab-list"))}).catch(function(e){console.log(e)})}},mounted:function(){var e=window.location.protocol,t=window.location.host;this.hostUrl=e+"//"+t}},r={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"index"},[i("div",{staticClass:"title"},[e._v("孙同学的网盘")]),e._v(" "),i("div",{staticClass:"label"},[e._v("Classmate-Sun’s Cloud")]),e._v(" "),i("div",{staticClass:"btn"},[i("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogFormVisible=!0}}},[e._v("登录")])],1),e._v(" "),i("el-dialog",{attrs:{title:"登录",visible:e.dialogFormVisible,width:"400px"},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("el-form",{attrs:{model:e.form}},[i("el-form-item",{attrs:{label:"用户名","label-width":e.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.signIn(t)}},model:{value:e.form.username,callback:function(t){e.$set(e.form,"username",t)},expression:"form.username"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"密码","label-width":e.formLabelWidth}},[i("el-input",{attrs:{autocomplete:"off",type:"password"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.signIn(t)}},model:{value:e.form.password,callback:function(t){e.$set(e.form,"password",t)},expression:"form.password"}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.signIn}},[e._v("登 录")])],1)],1)],1)},staticRenderFns:[]};var c=i("VU/8")(a,r,!1,function(e){i("i08I")},"data-v-b5b05c00",null).exports,d={name:"base-header",data:function(){return{username:sessionStorage.getItem("username")}},methods:{signOut:function(){this.$router.push({path:"/"}),sessionStorage.clear()}}},u={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"header"},[this._m(0),this._v(" "),t("div",{staticClass:"user"},[this._v("\n    用户: "+this._s(this.username)+"  "),t("a",{attrs:{href:"#"},on:{click:this.signOut}},[this._v("退出")])])])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"title"},[t("img",{staticStyle:{height:"65px",margin:"0px 7px -9px 0"},attrs:{src:i("7Otq"),height:"65",alt:"logo"}}),this._v("\n    孙同学的网盘"),t("span",{staticClass:"label"},[this._v("    Classmate-Sun’s Cloud")])])}]};var h=i("VU/8")(d,u,!1,function(e){i("YHoW")},"data-v-7354e67a",null).exports,f={name:"index",data:function(){return{date:(new Date).getFullYear()}}},p={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"footer"},[this._v("\n  Copyright © "+this._s(this.date)+"\n  "),t("a",{attrs:{href:"mailto:suntongxue@sun0623.top"}},[this._v("Classmate-Sun")]),this._v(" 版权所有\n")])},staticRenderFns:[]};var m=i("VU/8")(f,p,!1,function(e){i("+4Fl")},"data-v-035a5071",null).exports,v={data:function(){return{userInfo:{uid:sessionStorage.getItem("uid"),path:""},fileNum:0,hostUrl:""}},props:["dialogVisible"],watch:{},methods:{setPath:function(e){this.userInfo.path=e},submitUpload:function(){this.$refs.upload.submit()},dealSuccess:function(){this.$message.success("上传文件成功!"),this.fileNum+=1,this.fileNum===this.$refs.upload.uploadFiles.length&&(this.$emit("reGetFileList",this.userInfo.path),this.fileNum=0,this.$refs.upload.clearFiles())},dealError:function(){this.$message.error("上传文件失败,请重新上传!"),this.$emit("reGetFileList",this.userInfo.path)},handleClose:function(){this.$emit("reGetFileList",this.userInfo.path)}},mounted:function(){var e=window.location.protocol,t=window.location.host;this.hostUrl=e+"//"+t}},g={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-dialog",{attrs:{title:"上传文件",visible:e.dialogVisible,width:"600px","close-on-click-modal":!0},on:{"update:visible":function(t){e.dialogVisible=t}}},[i("el-upload",{ref:"upload",attrs:{drag:"",multiple:"",action:e.hostUrl+"/file/add","auto-upload":!1,data:e.userInfo,"on-success":e.dealSuccess,"on-error":e.dealError,"before-close":e.handleClose}},[i("i",{staticClass:"el-icon-upload"}),e._v(" "),i("div",{staticClass:"el-upload__text"},[e._v("将文件拖到此处，或"),i("em",[e._v("点击上传")])])]),e._v(" "),i("el-button",{staticStyle:{margin:"15px auto 0"},attrs:{size:"small",type:"success"},on:{click:e.submitUpload}},[e._v("开始上传")])],1)},staticRenderFns:[]};var w=i("VU/8")(v,g,!1,function(e){i("/gRd")},"data-v-2f9fb462",null).exports,_={directives:{Clickoutside:i("rdhm").a},components:{fileUpload:w},data:function(){return{moveFolderData:[{label:"我的网盘",path:"/",children:[]}],defaultProps:{children:"children",label:"label"},tableData:[],listType:"平铺",barFlag:2,clickFile:{},path:[],nowfolder:"我的网盘",newFilePath:"我的网盘",fileTypeClick:"全部",addfolderName:"",needMoveFileId:null,uid:0,ifShowUpload:!1,upPath:"",contextMenuTarget:document.querySelector(".listpp"),contextMenuVisible:!1,dialogFormVisible:!1,mouse:{x:"0px",y:"0px"},fullHeight:document.documentElement.clientHeight,height:document.documentElement.clientHeight-280,clickFolderData:null,hostUrl:"",downloadList:[],btnlist:!1}},watch:{fullHeight:function(e){if(!this.timer){this.fullHeight=e,this.timer=!0;var t=this;setTimeout(function(){t.timer=!1},400)}this.height=this.fullHeight-280}},methods:{ddownload:function(e,t,i){var o=this;this.downloadList[i]={url:"",netSpeed:"0Kb",netvindex:0,loaded:0,oldn:0,downloadFileName:"",percent:0},this.downloadList[i].url=e,this.downloadList[i].netSpeed="0Kb",this.downloadList[i].netvindex=setInterval(function(){o.downloadList[i].netSpeed=o.dealSize({size:o.downloadList[i].loaded-o.downloadList[i].oldn}),o.downloadList[i].oldn=o.downloadList[i].loaded},1e3),this.downloadList[i].downloadFileName=t;var s=new XMLHttpRequest;s.open("GET",e),s.send(null),s.responseType="blob",s.addEventListener("progress",function(e){var t=e.loaded/e.total*100;o.downloadList[i].loaded=e.loaded,o.downloadList[i].percent=t.toFixed(2),100===t&&setTimeout(function(){clearInterval(o.downloadList[i].netvindex)},1e3)}),s.onreadystatechange=function(e){if(4==s.readyState)if(200==s.status){s.getResponseHeader("Content-Type");var l=document.createElement("a");l.download=t,l.href=URL.createObjectURL(s.response),l.click(),URL.revokeObjectURL(l.href)}else 404==response.status?(alert("文件不存在"),o.downloadList[i].percent=0,o.downloadList[i].loaded=0,clearInterval(o.downloadList[i].netvindex),downloadList.splice(i,1)):500==response.status&&(alert("系统异常"),o.downloadList[i].percent=0,o.downloadList[i].loaded=0,clearInterval(o.downloadList[i].netvindex),downloadList.splice(i,1))}},downlodFile:function(e,t,i){if(0===this.downloadList.length)this.ddownload(e,t,i);else for(var o=0;o<=this.downloadList.length;o++){if(this.downloadList[o].url!==e)return void this.ddownload(e,t,i);this.$alert("此文件已在下载列表中","提示",{dangerouslyUseHTMLString:!0,showConfirmButton:!1,customClass:"messageBoxClass",closeOnClickModal:!0,lockScroll:!1,callback:function(e){}})}},judgType:function(e){return".folder"===e.toLowerCase()?"folder":".jpg"===e.toLowerCase()||".jpeg"===e.toLowerCase()||".png"===e.toLowerCase()||".tiff"===e.toLowerCase()||".bmp"===e.toLowerCase()||".gif"===e.toLowerCase()||".ico"===e.toLowerCase()?"img":".txt"===e.toLowerCase()||".html"===e.toLowerCase()||".css"===e.toLowerCase()||".js"===e.toLowerCase()||".log"===e.toLowerCase()||".json"===e.toLowerCase()||".url"===e.toLowerCase()||".vue"===e.toLowerCase()||".xml"===e.toLowerCase()?"TEXT":".mp3"===e.toLowerCase()?"MP3":".mp4"===e.toLowerCase()?"MP4":"其他"},dialogTXTBox:function(e){this.$alert('<div style="width:570px;height:750px;overflow:auto;"><pre class="txt'+e.id+'" style="margin:315px auto;">加载中......</pre>',""+e.file_name,{dangerouslyUseHTMLString:!0,showConfirmButton:!1,customClass:"messageTextBoxClass",closeOnClickModal:!1,lockScroll:!1,callback:function(e){}});var t=this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name;this.$http.get(t).then(function(t){var i=document.querySelector(".txt"+e.id);i.style.margin="0 auto",i.innerHTML="<xmp>"+t.data+"</xmp>"}).catch(function(e){console.log(e)})},dialogMovieBox:function(e){this.$alert('<video class="movie'+e.id+'" src="'+this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name+'" style="margin:0 auto;width:1070px;height:600px;" controls="controls" autoplay=true;>您的浏览器不支持在线播放！请先下载该资源！</video>',""+e.file_name,{dangerouslyUseHTMLString:!0,showConfirmButton:!1,customClass:"messageMp4BoxClass",closeOnClickModal:!1,lockScroll:!1,callback:function(t){"cancel"===t&&document.querySelector(".movie"+e.id).pause()}})},dialogMp3Box:function(e){this.$alert('<audio class="music'+e.id+'" src="'+this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name+'" style="margin:0 auto;width:470px;" controls="controls" autoplay=true;>您的浏览器不支持在线播放！请先下载该资源！</audio>',""+e.file_name,{dangerouslyUseHTMLString:!0,showConfirmButton:!1,customClass:"messageMp3BoxClass",closeOnClickModal:!1,lockScroll:!1,callback:function(t){"cancel"===t&&document.querySelector(".music"+e.id).pause()}})},dialogImageBox:function(e){this.$alert('<img src="'+this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name+'" alt="'+e.file_name+'" style="margin:0 auto;width:1170px;height:600px;object-fit: scale-down;">',""+e.file_name,{dangerouslyUseHTMLString:!0,showConfirmButton:!1,customClass:"messageBoxClass",closeOnClickModal:!0,lockScroll:!1,callback:function(e){}})},dialogMessageBox:function(){this.$alert("请下载后查看！","提示",{confirmButtonText:"确定",lockScroll:!1,callback:function(e){}})},findType:function(e){var t=this;if(this.fileTypeClick=e,this.path=[],this.closebar(),this.nowfolder="我的网盘","全部"===e)this.getFileList("我的网盘"),this.$refs.upFile.setPath("我的网盘");else{var i={uid:sessionStorage.getItem("uid"),type:e};this.$http.post(this.hostUrl+"/file/fileType",i).then(function(e){0===e.data.code?t.$message.error(e.data.msg):t.tableData=e.data}).catch(function(e){console.log(e)})}},moveFileNewFolder:function(){var e=this;this.$prompt("请输入文件夹名称","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(t){var i=t.value;i?(e.addfolder({file_name:i,path:e.newFilePath,uid:e.uid,hash_name:"folder"+(new Date).getTime()}),e.handleNodeClick(e.clickFolderData)):e.$message.error("文件名禁止为空")}).catch(function(){})},handleNodeClick:function(e){if(e){this.clickFolderData=e;var t="";t="/"===e.path?e.label:e.path,this.getfolderList(t,e)}else this.$message.error("请先选择文件夹！")},getfolderList:function(e,t){var i=this;this.newFilePath=e;var o={uid:sessionStorage.getItem("uid"),path:e};this.$http.post(this.hostUrl+"/file/list",o).then(function(e){if(0===e.data.code)i.$message.error(e.data.msg);else for(var o=e.data,s=[],l=0;l<o.length;l++)".folder"===o[l].type&&s.push({label:o[l].file_name,path:o[l].path+"/"+o[l].file_name,children:[]}),t.children=s}).catch(function(e){console.log(e)})},getIconType:function(e){var t=e.type.replace(/./,"").toLowerCase();return/^aep$|^ai$|^avi$|^cdr$|^css$|^doc$|^docx$|^dwg$|^eps$|^exe$|^folder$|^gif$|^html$|^ipa$|^iso$|^jpeg$|^jpg$|^js$|^json$|^log$|^mov$|^mp3$|^mp4$|^new$|^pdf$|^php$|^png$|^ppt$|^pptx$|^psd$|^rar$|^ttf$|^txt$|^url$|^vue$|^xls$|^xlsx$|^zip$|^bmp$|^raw$|^tiff$|^xml$/.test(t)?this.hostUrl+"/icon/"+t+".png":this.hostUrl+"/icon/unk.png"},reGetFileList:function(e){this.ifShowUpload=!1,this.refreshFileList(e),this.closebar()},addfolder:function(e){var t=this;""!==e?this.$http.post(this.hostUrl+"/file/addfolder",e).then(function(e){if(0===e.data.flag)t.$message.error(e.data.msg);else{t.$message.success(e.data.msg);var i="";i=0===t.path.length?t.nowfolder:t.path.join("/")+"/"+t.nowfolder,t.$refs.upFile.setPath(i),t.refreshFileList(i),t.closebar()}}).catch(function(e){console.log(e)}):this.$message.error("文件名禁止为空")},showUpAlert:function(){var e=this;this.ifShowUpload=!1,this.$confirm("选择建立文件夹或上传文件","提示",{distinguishCancelAndClose:!0,confirmButtonText:"上传文件",cancelButtonText:"新建文件夹",type:"info",center:!0}).then(function(){e.ifShowUpload=!0}).catch(function(t){e.ifShowUpload=!1,"cancel"===t&&e.$prompt("请输入文件夹名称","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(t){var i=t.value;if(i){var o="";o=0===e.path.length?e.nowfolder:e.path.join("/")+"/"+e.nowfolder,e.addfolder({file_name:i,path:o,uid:e.uid,hash_name:"folder"+(new Date).getTime()})}else e.$message.error("文件名禁止为空")}).catch(function(){})})},getPath:function(e,t){var i=this.path.length;this.path.splice(t,i-t),this.nowfolder=e;var o="";o=0===this.path.length?this.nowfolder:this.path.join("/")+"/"+this.nowfolder,this.$refs.upFile.setPath(o),this.refreshFileList(o),this.closebar()},gotofolder:function(e){this.path=e.path.split("/"),this.nowfolder=e.file_name;var t="";t=0===this.path.length?this.nowfolder:this.path.join("/")+"/"+this.nowfolder,this.$refs.upFile.setPath(t),this.refreshFileList(t),this.closebar()},closebar:function(){this.barFlag=2,this.clickFile={}},infoBar:function(e){this.barFlag=1,this.clickFile=e,this.clickFile.filesize=this.dealSize({size:1*e.size}),this.clickFile.downloadUrl=this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name,this.contextMenuVisible=!1},showRight:function(e){this.barFlag=1,this.clickFile=e,this.clickFile.filesize=this.dealSize({size:1*e.size}),this.clickFile.downloadUrl=this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name,this.contextMenuVisible=!0},closeRight:function(){this.contextMenuVisible=!1},showPopup:function(e){this.mouse.x=e.clientX+1+"px",this.mouse.y=e.clientY+1+"px"},moveFileBox:function(e,t){this.needMoveFileId=e,this.dialogFormVisible=!0},dialogMoveFileCancel:function(){this.needMoveFileId=null,this.newFilePath="我的网盘",this.dialogFormVisible=!1,this.moveFolderData=[{label:"我的网盘",path:"/",children:[]}],this.clickFolderData=null},dialogMoveFileOk:function(){""===this.newFilePath?this.$message({type:"error",message:"路径不能为空"}):(this.moveFile(),this.moveFolderData=[{label:"我的网盘",path:"/",children:[]}])},moveFile:function(){var e=this,t={id:this.needMoveFileId,newPath:this.newFilePath,uid:this.uid};this.$http.post(this.hostUrl+"/file/moveFile",t).then(function(t){if(0===t.data.code)e.$message.error(t.data.msg);else{var i="";i=0===e.path.length?e.nowfolder:e.path.join("/")+"/"+e.nowfolder,e.$message.success(t.data.msg),e.$refs.upFile.setPath(i),e.refreshFileList(i),e.closebar(),e.dialogFormVisible=!1,e.needMoveFileId=null,e.newFilePath="我的网盘"}}).catch(function(t){e.$message.error(res.data.msg),e.$refs.upFile.setPath(path),e.refreshFileList(path),e.closebar(),e.dialogFormVisible=!1,e.needMoveFileId=null,e.newFilePath="我的网盘",console.log(t)})},reFileNameBox:function(e){var t=this;this.$prompt("请输入文件名","提示",{confirmButtonText:"确定",cancelButtonText:"取消"}).then(function(i){var o=i.value;o?t.reFileName(e,o):t.$message.error("文件名禁止为空")}).catch(function(){})},reFileName:function(e,t){var i=this,o={id:e,file_Name:t,uid:this.uid};this.$http.post(this.hostUrl+"/file/reName",o).then(function(e){if(0===e.data.code)i.$message.error(e.data.msg);else{var t="";t=0===i.path.length?i.nowfolder:i.path.join("/")+"/"+i.nowfolder,i.$message.success(e.data.msg),i.$refs.upFile.setPath(t),i.refreshFileList(t),i.closebar()}}).catch(function(e){console.log(e)})},handleDelete:function(e,t){var i=this;this.$confirm("此操作将永久删除该文件, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",closeOnClickModal:!1,lockScroll:!1,type:"warning"}).then(function(){i.$http.delete(i.hostUrl+"/file/delete/"+t.hash_name+"/"+t.id).then(function(e){i.$message.success(e.data.msg);var t="";t=0===i.path.length?i.nowfolder:i.path.join("/")+"/"+i.nowfolder,i.$refs.upFile.setPath(t),i.refreshFileList(t),i.closebar()}).catch(function(e){console.log("Error=>",e)})}).catch(function(){i.$message({type:"info",message:"已取消删除"})})},handleShare:function(e,t){var i=this,o=this.hostUrl+"/file/download/"+t.id+"/"+t.hash_name;this.$confirm('<p style="word-wrap: break-word; word-break: break-all;">'+o+"</p>","点击确定复制以下链接分享给好友哦~",{dangerouslyUseHTMLString:!0,confirmButtonText:"确定",cancelButtonText:"取消",type:"success"}).then(function(){i.$copyText(o).then(function(e){i.$message({type:"success",message:"已复制到剪切板!"})},function(e){i.$message({type:"error",message:"复制失败!"})})}).catch(function(){i.$message({type:"info",message:"已取消分享!"})})},handleDownload:function(e){var t=this;if(".folder"!==e.type){var i=this.getFile(e);this.downlodFile(i,e.file_name,this.downloadList.length)}var o="";o=0===this.path.length?this.nowfolder:this.path.join("/")+"/"+this.nowfolder,this.$refs.upFile.setPath(o),setTimeout(function(){t.refreshFileList(o),t.closebar()},1e3)},refreshFileList:function(e){this.getFileList(e)},getFileList:function(e){var t=this,i={uid:sessionStorage.getItem("uid"),path:e};this.uid=sessionStorage.getItem("uid"),this.$http.post(this.hostUrl+"/file/list",i).then(function(e){0===e.data.code?t.$message.error(e.data.msg):t.tableData=e.data}).catch(function(e){console.log(e)})},getFile:function(e){return this.hostUrl+"/file/download/"+e.id+"/"+e.hash_name},dealSize:function(e,t){return 0<e.size&&e.size<102.4?e.size+"byte":102.4<=e.size&&e.size<1048576?(e.size/1024).toFixed(2)+"Kb":1048576<=e.size&&e.size<1073741824?(e.size/1024/1024).toFixed(2)+"Mb":1073741824<=e.size&&e.size<1099511627776?(e.size/1024/1024/1024).toFixed(2)+"Gb":void 0},dealTime:function(e,t){return this.formatTime(e.upload_time)},formatTime:function(e){var t=new Date(e);return t.getFullYear()+"-"+(t.getMonth()+1<10?"0"+(t.getMonth()+1):t.getMonth()+1)+"-"+(t.getDate()<10?"0"+t.getDate():t.getDate())+" "+(t.getHours()<10?"0"+t.getHours():t.getHours())+":"+(t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes())+":"+(t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds())}},mounted:function(){var e=window.location.protocol,t=window.location.host;this.hostUrl=e+"//"+t;var i=this;window.onresize=function(){return window.fullHeight=document.documentElement.clientHeight,void(i.fullHeight=window.fullHeight)},this.height=this.fullHeight-280,this.getFileList("我的网盘"),this.$refs.upFile.setPath("我的网盘")}},b={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{directives:[{name:"clickoutside",rawName:"v-clickoutside:outside",value:e.closebar,expression:"closebar",arg:"outside"}],on:{click:e.closeRight}},[i("div",{staticClass:"dllistbtn",on:{click:function(t){e.btnlist=!e.btnlist}}},[e._v("下载列表")]),e._v(" "),i("el-dialog",{staticClass:"moveDialog",attrs:{title:"选择移动位置",visible:e.dialogFormVisible,width:"600px","show-close":!1},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("div",{staticClass:"folderTree"},[i("el-tree",{attrs:{data:e.moveFolderData,props:e.defaultProps,accordion:"","node-key":"id","default-expand-all":"","expand-on-click-node":!1},on:{"node-click":e.handleNodeClick}})],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{staticStyle:{float:"left"},attrs:{size:"mini"},on:{click:function(t){return e.moveFileNewFolder()}}},[e._v("新建文件夹")]),e._v(" "),i("el-button",{attrs:{size:"mini"},on:{click:function(t){return e.dialogMoveFileCancel()}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"primary"},on:{click:function(t){return e.dialogMoveFileOk()}}},[e._v("确 定")])],1)]),e._v(" "),i("context-menu",{staticClass:"right-menu",style:{display:!0===e.contextMenuVisible?"block":"none",top:e.mouse.y,left:e.mouse.x},attrs:{target:e.contextMenuTarget}},[".folder"!==e.clickFile.type?i("a",{attrs:{href:"javascript:void(0);"},on:{click:function(t){return e.handleDownload(e.clickFile)}}},[e._v("下载")]):e._e(),e._v(" "),".folder"!==e.clickFile.type?i("a",{attrs:{href:"javascript:;"},on:{click:function(t){return e.handleShare(e.clickFile.id,e.clickFile)}}},[e._v("分享")]):e._e(),e._v(" "),".folder"!==e.clickFile.type?i("a",{attrs:{href:"javascript:;"},on:{click:function(t){return e.moveFileBox(e.clickFile.id,e.clickFile)}}},[e._v("移动")]):e._e(),e._v(" "),i("a",{attrs:{href:"javascript:;"},on:{click:function(t){return e.reFileNameBox(e.clickFile.id)}}},[e._v("重命名")]),e._v(" "),i("a",{attrs:{href:"javascript:;"},on:{click:function(t){return e.handleDelete(e.clickFile.id,e.clickFile)}}},[e._v("删除")])]),e._v(" "),i("div",{staticClass:"fixedBox"},[i("div",{staticClass:"leftNav"},[i("div",{class:{leftNavBtn:!0,leftNavBtnClick:"全部"===this.fileTypeClick},on:{click:function(t){return e.findType("全部")}}},[i("i",{staticClass:"el-icon-folder"}),e._v("  全部\n      ")]),e._v(" "),i("div",{class:{leftNavBtn:!0,leftNavBtnClick:"图片"===this.fileTypeClick},on:{click:function(t){return e.findType("图片")}}},[i("i",{staticClass:"el-icon-picture-outline"}),e._v("  图片\n      ")]),e._v(" "),i("div",{class:{leftNavBtn:!0,leftNavBtnClick:"视频"===this.fileTypeClick},on:{click:function(t){return e.findType("视频")}}},[i("i",{staticClass:"el-icon-film"}),e._v("  视频\n      ")]),e._v(" "),i("div",{class:{leftNavBtn:!0,leftNavBtnClick:"音乐"===this.fileTypeClick},on:{click:function(t){return e.findType("音乐")}}},[i("i",{staticClass:"el-icon-service"}),e._v("  音乐\n      ")]),e._v(" "),i("div",{class:{leftNavBtn:!0,leftNavBtnClick:"文档"===this.fileTypeClick},on:{click:function(t){return e.findType("文档")}}},[i("i",{staticClass:"el-icon-tickets"}),e._v("  文档\n      ")]),e._v(" "),i("div",{class:{leftNavBtn:!0,leftNavBtnClick:"压缩"===this.fileTypeClick},on:{click:function(t){return e.findType("压缩")}}},[i("i",{staticClass:"el-icon-box"}),e._v("  压缩\n      ")])]),e._v(" "),i("div",{staticClass:"navBar"},[i("div",{staticClass:"navB"},[i("el-breadcrumb",{attrs:{separator:"/"}},[e._l(e.path,function(t,o){return i("el-breadcrumb-item",{key:o},[i("a",{on:{click:function(i){return e.getPath(t,o)}}},[e._v(e._s(t))])])}),e._v(" "),i("el-breadcrumb-item",[e._v("\n            "+e._s(e.nowfolder)+"\n          ")])],2)],1),e._v(" "),i("div",{staticClass:"view"},[i("el-radio-group",{model:{value:e.listType,callback:function(t){e.listType=t},expression:"listType"}},[i("span",{staticClass:"viewTip"},[e._v("视图：")]),e._v(" "),i("el-radio",{attrs:{label:"平铺"}}),e._v(" "),i("el-radio",{attrs:{label:"列表"}})],1)],1)])]),e._v(" "),i("div",{staticClass:"fileBox"},["列表"===e.listType?i("el-table",{staticStyle:{width:"1015px","margin-left":"184px","margin-top":"-50px",padding:"0"},attrs:{height:e.height,data:e.tableData,"cell-style":{"text-align":"center"},"header-cell-style":{"text-align":"center"}}},[i("el-table-column",{attrs:{type:"index"}}),e._v(" "),i("el-table-column",{attrs:{prop:"file_name",label:"文件名",width:"180px"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("el-button",{attrs:{disabled:".folder"!==t.row.type,type:"text",size:"small"},nativeOn:{click:function(i){return i.preventDefault(),e.gotofolder(t.row)}}},[e._v("\n            "+e._s(t.row.file_name)+"\n          ")])]}}])}),e._v(" "),i("el-table-column",{attrs:{prop:"size",label:"大小",width:"130px",formatter:e.dealSize}}),e._v(" "),i("el-table-column",{attrs:{prop:"upload_time",label:"上传时间",width:"170px",formatter:e.dealTime}}),e._v(" "),i("el-table-column",{attrs:{prop:"download",label:"下载次数",width:"120px"}}),e._v(" "),i("el-table-column",{attrs:{label:"操作","min-width":"350px"},scopedSlots:e._u([{key:"default",fn:function(t){return[i("a",{attrs:{href:"javascript:void(0);"}},[i("el-button",{attrs:{size:"mini",type:"success",disabled:".folder"===t.row.type},on:{click:function(i){return e.handleDownload(t.row)}}},[e._v("下载")])],1),e._v(" "),i("el-button",{attrs:{size:"mini",type:"primary",disabled:".folder"===t.row.type},on:{click:function(i){return e.handleShare(t.$index,t.row)}}},[e._v("分享")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"warning",disabled:".folder"===t.row.type},on:{click:function(i){return e.moveFileBox(t.row.id,t.row)}}},[e._v("移动")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"info"},on:{click:function(i){return e.reFileNameBox(t.row.id)}}},[e._v("重命名")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(i){return e.handleDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1):e._e(),e._v(" "),"平铺"===e.listType?i("div",{staticClass:"listpp"},[i("div",{staticClass:"infoBox outside"},[1===e.barFlag?i("div",{staticClass:"infoBar outside"},[".folder"!==e.clickFile.type?i("p",{staticClass:"fs outside"},[e._v("\n            大小：\n            "+e._s(e.clickFile.filesize)+"\n          ")]):e._e(),e._v(" "),i("p",{staticClass:"ft outside"},[e._v("\n            上传时间：\n            "+e._s(e.clickFile.upload_time)+"\n          ")]),e._v(" "),".folder"!==e.clickFile.type?i("p",{staticClass:"fd outside"},[e._v("\n            下载次数：\n            "+e._s(e.clickFile.download)+"\n          ")]):e._e(),e._v(" "),i("div",{staticClass:"fb outside"},[i("a",{attrs:{href:"javascript:void(0);"}},[i("el-button",{attrs:{size:"mini",type:"success",disabled:".folder"===e.clickFile.type},on:{click:function(t){return e.handleDownload(e.clickFile)}}},[e._v("下载")])],1),e._v(" "),i("el-button",{attrs:{size:"mini",type:"primary",disabled:".folder"===e.clickFile.type},on:{click:function(t){return e.handleShare(e.clickFile.id,e.clickFile)}}},[e._v("分享")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"warning",disabled:".folder"===e.clickFile.type},on:{click:function(t){return e.moveFileBox(e.clickFile.id,e.clickFile)}}},[e._v("移动")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"info"},on:{click:function(t){return e.reFileNameBox(e.clickFile.id)}}},[e._v("重命名")]),e._v(" "),i("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(t){return e.handleDelete(e.clickFile.id,e.clickFile)}}},[e._v("删除")])],1)]):e._e()]),e._v(" "),e._l(e.tableData,function(t){return i("div",{key:t.id,class:{fileListpp:!0,fileListppClick:t.id===e.clickFile.id}},["MP3"===e.judgType(t.type)?i("div",{staticClass:"clickBox",on:{click:function(i){return e.infoBar(t)},contextmenu:function(i){return i.preventDefault(),e.showRight(t)},dblclick:function(i){return e.dialogMp3Box(t)},mouseup:e.showPopup}},[i("div",{staticClass:"fileIcon outside"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.getIconType(t),alt:t.file_name}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            "+e._s(t.file_name)+"\n          ")])]):e._e(),e._v(" "),"MP4"===e.judgType(t.type)?i("div",{staticClass:"clickBox",on:{click:function(i){return e.infoBar(t)},contextmenu:function(i){return i.preventDefault(),e.showRight(t)},dblclick:function(i){return e.dialogMovieBox(t)},mouseup:e.showPopup}},[i("div",{staticClass:"fileIcon outside"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.getIconType(t),alt:t.file_name}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            "+e._s(t.file_name)+"\n          ")])]):e._e(),e._v(" "),"TEXT"===e.judgType(t.type)?i("div",{staticClass:"clickBox",on:{click:function(i){return e.infoBar(t)},contextmenu:function(i){return i.preventDefault(),e.showRight(t)},dblclick:function(i){return e.dialogTXTBox(t)},mouseup:e.showPopup}},[i("div",{staticClass:"fileIcon outside"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.getIconType(t),alt:t.file_name}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            "+e._s(t.file_name)+"\n          ")])]):e._e(),e._v(" "),"img"===e.judgType(t.type)?i("div",{staticClass:"clickBox",on:{click:function(i){return e.infoBar(t)},contextmenu:function(i){return i.preventDefault(),e.showRight(t)},dblclick:function(i){return e.dialogImageBox(t)},mouseup:e.showPopup}},[i("div",{staticClass:"fileIcon outside"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.getIconType(t),alt:t.file_name}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            "+e._s(t.file_name)+"\n          ")])]):e._e(),e._v(" "),"其他"===e.judgType(t.type)?i("div",{staticClass:"clickBox",on:{click:function(i){return e.infoBar(t)},contextmenu:function(i){return i.preventDefault(),e.showRight(t)},dblclick:function(t){return e.dialogMessageBox()},mouseup:e.showPopup}},[i("div",{staticClass:"fileIcon outside"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.getIconType(t),alt:t.file_name}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            "+e._s(t.file_name)+"\n          ")])]):e._e(),e._v(" "),"folder"===e.judgType(t.type)?i("div",{staticClass:"clickBox",on:{click:function(i){return e.infoBar(t)},contextmenu:function(i){return i.preventDefault(),e.showRight(t)},dblclick:function(i){return e.gotofolder(t)},mouseup:e.showPopup}},[i("div",{staticClass:"fileIcon outside"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.getIconType(t),alt:t.file_name}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            "+e._s(t.file_name)+"\n          ")])]):e._e()])}),e._v(" "),"全部"===e.fileTypeClick?i("div",{staticClass:"fileListpp"},[i("div",{staticClass:"clickBox",on:{click:function(t){return e.showUpAlert()}}},[i("div",{staticClass:"fileIcon"},[i("img",{staticClass:"icon",attrs:{width:"256",height:"256",src:e.hostUrl+"/icon/up.png",alt:"上传文件"}})]),e._v(" "),i("p",{staticClass:"fileName",staticStyle:{"-webkit-box-orient":"vertical"}},[e._v("\n            上传文件\n          ")])])]):e._e()],2):e._e()],1),e._v(" "),i("fileUpload",{ref:"upFile",attrs:{dialogVisible:e.ifShowUpload},on:{reGetFileList:e.reGetFileList}}),e._v(" "),e.btnlist?i("div",{staticClass:"downList"},[i("el-table",{staticStyle:{width:"300px"},attrs:{data:e.downloadList}},[i("el-table-column",{attrs:{prop:"downloadFileName",label:"文件名",width:"20"}}),e._v(" "),i("el-table-column",{attrs:{label:"进度",width:"180"},scopedSlots:e._u([{key:"default",fn:function(e){return[i("el-progress",{attrs:{percentage:e.row.percent}})]}}])}),e._v(" "),i("el-table-column",{attrs:{label:"速度"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.row.netSpeed)+"/s ")]}}])})],1)],1):e._e()],1)},staticRenderFns:[]};var k={data:function(){var e=this;return{ruleForm:{oldPass:"",newPass:"",checkNewPass:""},rules:{oldPass:[{validator:function(t,i,o){""===i?o(new Error("请输入密码")):(""!==e.ruleForm.oldPass&&e.$refs.ruleForm.validateField("newPass"),o())},trigger:"blur"}],newPass:[{validator:function(t,i,o){""===i?o(new Error("请输入新密码")):i===e.ruleForm.oldPass?o(new Error("新旧密码不能相同!")):o()},trigger:"blur"}],checkNewPass:[{validator:function(t,i,o){""===i?o(new Error("请再次输入密码")):i!==e.ruleForm.newPass?o(new Error("两次输入密码不一致!!")):o()},trigger:"blur"}]},hostUrl:""}},methods:{submitForm:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;var i={oldPassword:t.ruleForm.oldPass,newPassword:t.ruleForm.newPass};t.$http.put(t.hostUrl+"/user/update/"+sessionStorage.uid,i).then(function(e){t.$message.success("修改密码成功!请重新登录"),sessionStorage.clear(),setTimeout(function(){t.$router.push({path:"/"})},1e3)}).catch(function(e){console.log("Error=>",e)})})},resetForm:function(e){this.$refs[e].resetFields()}},mounted:function(){var e=window.location.protocol,t=window.location.host;this.hostUrl=e+"//"+t}},F={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("el-form",{ref:"ruleForm",staticClass:"change-password",attrs:{model:e.ruleForm,"status-icon":"",rules:e.rules,"label-width":"100px"}},[i("el-form-item",{attrs:{label:"原密码",prop:"oldPass"}},[i("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.ruleForm.oldPass,callback:function(t){e.$set(e.ruleForm,"oldPass",t)},expression:"ruleForm.oldPass"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"新密码",prop:"newPass"}},[i("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.ruleForm.newPass,callback:function(t){e.$set(e.ruleForm,"newPass",t)},expression:"ruleForm.newPass"}})],1),e._v(" "),i("el-form-item",{attrs:{label:"确认新密码",prop:"checkNewPass"}},[i("el-input",{attrs:{type:"password",autocomplete:"off"},model:{value:e.ruleForm.checkNewPass,callback:function(t){e.$set(e.ruleForm,"checkNewPass",t)},expression:"ruleForm.checkNewPass"}})],1),e._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v("提交")]),e._v(" "),i("el-button",{on:{click:function(t){return e.resetForm("ruleForm")}}},[e._v("重置")])],1)],1)],1)},staticRenderFns:[]};var x={name:"show",components:{BaseHeader:h,BaseFooter:m,UploadFile:w,FileList:i("VU/8")(_,b,!1,function(e){i("xYjR")},"data-v-0aead9f2",null).exports,userSet:i("VU/8")(k,F,!1,function(e){i("4vLI")},"data-v-67026251",null).exports},data:function(){return{path:"",tabActivedName:"first",componentList:[{tabName:"first",compoName:"file-list",tabLabel:"文件列表"},{tabName:"third",compoName:"user-set",tabLabel:"用户设置"}],download:[]}},methods:{handleClick:function(e,t){this.tabActivedName=e.name},getDownloadList:function(e){this.download=e,console.log(this.download)}}},y={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"show"},[i("base-header"),e._v(" "),i("el-tabs",{staticClass:"tab",attrs:{type:"card"},on:{"tab-click":e.handleClick},model:{value:e.tabActivedName,callback:function(t){e.tabActivedName=t},expression:"tabActivedName"}},e._l(e.componentList,function(e,t){return i("el-tab-pane",{key:t,attrs:{label:e.tabLabel,name:e.tabName}})}),1),e._v(" "),"first"===e.tabActivedName?i("FileList"):e._e(),e._v(" "),"third"===e.tabActivedName?i("userSet"):e._e(),e._v(" "),i("base-footer")],1)},staticRenderFns:[]};var C=i("VU/8")(x,y,!1,function(e){i("T3hb")},"data-v-3e52eeb2",null).exports;o.default.use(n.a);var $=new n.a({routes:[{path:"/",name:"index",component:c},{path:"/tab-list",name:"tab-list",component:C}]});$.beforeEach(function(e,t,i){if("tab-list"===e.name){if(!sessionStorage.username)return window.alert("您的登录信息无效或过期，请重新登录"),window.location.replace("/");i()}else i()});var L=$,T=i("//Fk"),B=i.n(T),S=i("Dd8w"),P=i.n(S),U=i("mtWM"),N=i.n(U).a.create(),M=window.location.protocol,I=window.location.host;N.defaults.baseURL=M+"//"+I+"/",N.defaults.timeout=5e3,N.formurl=function(e,t,i){return N.post(e,t,P()({headers:{"Content-Type":"application/x-www-form-urlencoded"}},i))},N.interceptors.request.use(function(e){return e},function(e){return B.a.reject(e)}),N.interceptors.response.use(function(e){if(200===e.status)return B.a.resolve(e)},function(e){return B.a.reject(e)});var z=N,j=i("zL8q"),D=i.n(j),V=i("81Pc"),R=i.n(V),E=i("wvfG"),H=i.n(E);i("tvR6"),i("6X/o");o.default.prototype.$http=z,o.default.config.productionTip=!1,o.default.use(D.a),o.default.use(R.a),o.default.use(H.a),new o.default({el:"#app",router:L,components:{App:l},template:"<App/>"})},T3hb:function(e,t){},YHoW:function(e,t){},i08I:function(e,t){},tvR6:function(e,t){},xYjR:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.a1f646aa11cc82ca16c5.js.map