(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5fa310b6"],{5319:function(t,e,a){"use strict";var n=a("d784"),r=a("825a"),i=a("7b0b"),l=a("50c4"),s=a("a691"),o=a("1d80"),c=a("8aa5"),u=a("14c3"),h=Math.max,d=Math.min,f=Math.floor,g=/\$([$&'`]|\d\d?|<[^>]*>)/g,p=/\$([$&'`]|\d\d?)/g,m=function(t){return void 0===t?t:String(t)};n("replace",2,(function(t,e,a,n){var v=n.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE,w=n.REPLACE_KEEPS_$0,b=v?"$":"$0";return[function(a,n){var r=o(this),i=void 0==a?void 0:a[t];return void 0!==i?i.call(a,r,n):e.call(String(r),a,n)},function(t,n){if(!v&&w||"string"===typeof n&&-1===n.indexOf(b)){var i=a(e,t,this,n);if(i.done)return i.value}var o=r(t),f=String(this),g="function"===typeof n;g||(n=String(n));var p=o.global;if(p){var S=o.unicode;o.lastIndex=0}var y=[];while(1){var T=u(o,f);if(null===T)break;if(y.push(T),!p)break;var D=String(T[0]);""===D&&(o.lastIndex=c(f,l(o.lastIndex),S))}for(var k="",x=0,E=0;E<y.length;E++){T=y[E];for(var C=String(T[0]),L=h(d(s(T.index),f.length),0),H=[],P=1;P<T.length;P++)H.push(m(T[P]));var M=T.groups;if(g){var O=[C].concat(H,L,f);void 0!==M&&O.push(M);var N=String(n.apply(void 0,O))}else N=_(C,f,L,H,M,n);L>=x&&(k+=f.slice(x,L)+N,x=L+C.length)}return k+f.slice(x)}];function _(t,a,n,r,l,s){var o=n+t.length,c=r.length,u=p;return void 0!==l&&(l=i(l),u=g),e.call(s,u,(function(e,i){var s;switch(i.charAt(0)){case"$":return"$";case"&":return t;case"`":return a.slice(0,n);case"'":return a.slice(o);case"<":s=l[i.slice(1,-1)];break;default:var u=+i;if(0===u)return e;if(u>c){var h=f(u/10);return 0===h?e:h<=c?void 0===r[h-1]?i.charAt(1):r[h-1]+i.charAt(1):e}s=r[u-1]}return void 0===s?"":s}))}}))},"90b1":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"tableboxtop50"},[a("div",{staticClass:"searchBar"},[a("el-date-picker",{attrs:{type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",format:"yyyy-MM-dd","value-format":"timestamp",size:"small"},model:{value:t.searchDate,callback:function(e){t.searchDate=e},expression:"searchDate"}}),a("el-button",{staticClass:"searchBtn",attrs:{type:"primary",round:"",size:"small"},on:{click:t.handleSearch}},[t._v("搜索")]),a("div",{staticClass:"filterBox"},[a("el-input",{attrs:{size:"small",placeholder:"输入接口路由筛选"},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{data:t.list.filter((function(e){return!t.search||e.url.toLowerCase().includes(t.search.toLowerCase())})),height:t.height}},[a("el-table-column",{attrs:{type:"index",index:t.indexMethod,label:"序号",width:"50"}}),a("el-table-column",{attrs:{label:"访问时间",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(t.formatTime(e.row.time))+" ")]}}])}),a("el-table-column",{attrs:{label:"协议",width:"90"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",{staticStyle:{"font-weight":"bold"},domProps:{innerHTML:t._s(t.formatText(e.row.method))}})]}}])}),a("el-table-column",{attrs:{label:"HTTP版本",width:"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.httpVersion)+" ")]}}])}),a("el-table-column",{attrs:{label:"访问接口",width:"300"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.url)+" ")]}}])}),a("el-table-column",{attrs:{label:"访问数据",width:"120"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-popover",{attrs:{trigger:"hover",placement:"top"}},[a("p",[t._v(t._s(e.row.data))]),a("div",{staticClass:"name-wrapper",attrs:{slot:"reference"},slot:"reference"},[a("el-tag",{attrs:{size:"medium"}},[t._v("查看数据")])],1)])]}}])}),a("el-table-column",{attrs:{label:"客户端IP",width:"140"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.clientIP)+" ")]}}])}),a("el-table-column",{attrs:{label:"客户端软件",width:"210"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.clientUa)+" ")]}}])}),a("el-table-column",{attrs:{label:"客户端OS","min-width":"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.clientSystem)+" ")]}}])})],1),a("el-pagination",{staticClass:"page",attrs:{background:"","page-size":50,layout:"total, prev, pager, next, jumper",total:t.alldata},on:{"current-change":t.handleCurrentChange}})],1)},r=[],i=(a("ac1f"),a("5319"),a("365c")),l=a("e3c6"),s=a.n(l),o={name:"NetLogView",data:function(){return{searchDate:[(new Date).getTime(),(new Date).getTime()],lastsearchDate:[(new Date).getTime(),(new Date).getTime()],alldata:5e3,page:1,list:[],search:"",fullHeight:document.documentElement.clientHeight,height:document.documentElement.clientHeight-195,loading:!1}},watch:{fullHeight:function(t){if(!this.timer){this.fullHeight=t,this.timer=!0;var e=this;setTimeout((function(){e.timer=!1}),400)}this.height=this.fullHeight-195},page:function(t){this.$refs.table.bodyWrapper.scrollTop=0}},methods:{handleSearch:function(){this.lastsearchDate=this.searchDate,this.page=1,this.getNetLogList(1,this.lastsearchDate)},handleCurrentChange:function(t){this.page=t,this.getNetLogList1(t,this.lastsearchDate)},formatTime:function(t){var e=new Date(t).getTime(),a="";return e>0&&(a=s()("YYYY-MM-DD HH:mm:ss",e-288e5)),a},formatText:function(t){return t.replace("GET",'<span style="color: #4AB793">GET</span>').replace("POST",'<span style="color: #C37933">POST</span>').replace("OPTIONS",'<span style="color: #187FDE">OPTIONS</span>')},getTime:function(t){return s()("YYYY-MM-DD hh:mm:ss",t)},indexMethod:function(t){return t+1+50*(this.page-1)},getNetLogList1:function(t,e){var a=this;this.loading=!0,Object(i["g"])({from:50*(t-1),dateArr:e}).then((function(t){a.list=t.data.data,a.loading=!1}))},getNetLogList:function(t,e){var a=this;this.loading=!0,Object(i["f"])({dateArr:e}).then((function(n){0===n.data.code&&(a.alldata=n.data.num,Object(i["g"])({from:50*(t-1),dateArr:e}).then((function(t){a.list=t.data.data,a.loading=!1})))}))}},mounted:function(){var t=this;window.onresize=function(){return function(){window.fullHeight=document.documentElement.clientHeight,t.fullHeight=window.fullHeight}()},this.height=this.fullHeight-195,this.getNetLogList(1,this.searchDate)}},c=o,u=(a("f710"),a("2877")),h=Object(u["a"])(c,n,r,!1,null,"59f49600",null);e["default"]=h.exports},9239:function(t,e,a){},f710:function(t,e,a){"use strict";var n=a("9239"),r=a.n(n);r.a}}]);