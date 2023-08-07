const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const User = require('./user.model');
const Question = require('./question.model'); // Importa el modelo de Question

class Survey extends Model {}

Survey.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Survey',
  tableName: 'surveys',
  timestamps: false
});

Survey.belongsTo(User, { as: "user", foreignKey: 'creator_user_id' }); // Relación con Usuario

module.exports = Survey;
