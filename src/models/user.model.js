const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');

class User extends Model { }

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  img: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  role: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  attempts: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  blocked: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false
});

module.exports = User;
