const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', '', '', {
  host: '',
  dialect: 'sqlite',
  
  storage: 'data/test.sqlite'
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

// User.sync({force: false}).then(() => {
//   return User.create({
//     name: '小夏',
//     age: 20
//   })
// })

User.findAll().then(users => {
  console.log(users);
})