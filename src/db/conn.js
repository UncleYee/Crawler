const Sequelize = require('sequelize');
const log4js = require('log4js');

// 初始化数据库连接
const initConn = (config) => {

  // log4js 配置
  log4js.configure({
    appenders: {
      cheese: {
        type: 'file',
        filename: config.LOG_PATH_NAME
      }
    },
    categories: { default: { appenders: ['cheese'], level: 'debug' } }
  })

  // log4js 实例
  const logger = log4js.getLogger('sqlite');
  // Sequelize 实例
  const sequelize = new Sequelize(config.DB_NAME, '', '', {
    host: '',
    dialect: 'sqlite',
    storage: config.DB_PATH,
    // 日志
    logging: function(sql) {
      logger.info(sql);
    }
  });

  // 链接数据库
  sequelize
  .authenticate()
  .then(() => {
    console.log('数据库连接成功！');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

}

module.exports = initConn;