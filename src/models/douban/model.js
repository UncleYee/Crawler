const Sequelize = require('sequelize');
const sequelize = require('./conn');

const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING
  },
  age: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false
});

const Comment = sequelize.define('comment', {
  time: {
    type: Sequelize.STRING
  },
  score: {
    type: Sequelize.INTEGER
  }
}, {
  timestamps: false
})

module.exports = {
  User: User,
  Comment: Comment
}