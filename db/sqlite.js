const Sequelize = require('sequelize');
var log4js = require('log4js');
log4js.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: 'default.log'
    }
  },
  categories: { default: { appenders: ['cheese'], level: 'debug' } }
})

var logger = log4js.getLogger('sqlite');

const sequelize = new Sequelize('test', '', '', {
  host: '',
  dialect: 'sqlite',
  
  storage: 'data/test.sqlite',
  logging: function(sql) {
    logger.info(sql);
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  }
});

User.sync({force: false}).then(() => {
  return User.create({
    name: '小夏',
    age: 20
  })
})

// User.findAll().then(users => {
//   console.log(users);
// })