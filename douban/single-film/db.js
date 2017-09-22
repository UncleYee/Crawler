const sequelize = require('./conn');
const {User, Comment} = require('./model');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


Comment.sync({force: false}).then(() => {
  return Comment.create({
    time: '2017-08-02 19:02:56',
    score: 10
  })
})

Comment.findAll().then(comments => {
  console.log(comments);
})