const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:Hajimetenoaku1@localhost:5432/todos');

const Todo = sequelize.define('Todo', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  paranoid: true, // Enable soft delete
  timestamps: true, 
});

module.exports = Todo;
