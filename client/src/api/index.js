import axios from 'axios'


let protocol = window.location.protocol; //协议
let host = window.location.host; //主机
//动态请求地址                协议             主机
// if (/localhost/.test(host)) {


//配置默认的参数
axios.defaults.withCredentials = true; //跨域允许携带cookie
if (host == "127.0.0.1:8080") {
  axios.defaults.baseURL = 'http://127.0.0.1:8081';//默认访问地址
} else {
  axios.defaults.baseURL = protocol + "//" + host;
}
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //设置POST请求格式

//获取日志
export function getLogList(from) {
  return axios.post("/web/getLog", from);
}

//获取日志
export function getLogCount(from) {
  return axios.post("/web/getLogCount", from);
}

//获取日志
export function getNetLogList(from) {
  return axios.post("/web/getNetLog", from);
}

//获取日志
export function getNetLogCount(from) {
  return axios.post("/web/getNetLogCount", from);
}

//获取日志
export function getTaskList(from) {
  return axios.post("/web/getTask", from);
}

//获取日志
export function getTaskCount(from) {
  return axios.post("/web/getTaskCount", from);
}

//获取日志
export function getReprintList(from) {
  return axios.post("/web/getReprintList", from);
}

//获取日志
export function getReprintListCount(from) {
  return axios.post("/web/getReprintListCount", from);
}

//零件名列表
export function getPnName(from) {
  return axios.post("/web/getPnName", from);
}

/*请求用户列表*/
export function getUserList() {
  return axios.get("/web/getuser");
}

/*删除用户*/
export function deleteUser(UID, username) {
  return axios.post("/web/deleteuser", { UID, username });
}

/*更新用户数据*/
export function updateUser(data) {
  return axios.post('/web/updateuser', data);
}

/*获取料架信息*/
export function getLocation(data) {
  return axios.post('/web/getLocation', data);
}

/*获取库位列表*/
export function getLocationExcel() {
  // return axios.get('/web/getLocationExcel');
  return axios({
    method: 'get',
    url: '/web/getLocationExcel',
    responseType: 'arraybuffer'
  })
}


/*更新料架信息*/
export function updateLocation(data) {
  return axios.post('/web/updateLocation', data);
}

/*登陆接口*/
export function login(options) {
  return axios.post('/login', options);
}

/*验证登陆*/
export function ifLogin() {
  return axios.post("/login/ifLogin");
}

/*退出登陆*/
export function logout() {
  return axios.get("/login/logout");
}

/*退出登陆*/
export function getVersion() {
  return axios.get("/update/getVersion");
}