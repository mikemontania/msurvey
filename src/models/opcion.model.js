const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Question = require('./question.model');

class Option extends Model {}

Option.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  optionText: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Option',
  tableName: 'options',
  timestamps: false
});

Option.belongsTo(Question, { as: "question",  foreignKey: 'question_id' }); // Relación con Pregunta

module.exports = Option;
