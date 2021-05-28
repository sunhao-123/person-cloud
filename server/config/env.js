//  数据库连接参数
const env = {
  database: '*********',//your database name
  username: '*********',//your database username
  password: '*********',//your database password
  port: 3306,
  host: '127.0.0.1',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
module.exports = env;
