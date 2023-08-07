const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Question = require('./question.model');
const User = require('./user.model');

class Answer extends Model {}

Answer.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  answerType: {
    type: DataTypes.STRING,
    allowNull: true
    , 
  },
  answerText: {
    type: DataTypes.STRING,
    allowNull: true 
  }
}, {
  sequelize,
  modelName: 'Answer',
  tableName: 'answers',
  timestamps: false
});

Answer.belongsTo(Question, {  as: "question", foreignKey: 'question_id' }); // Relación con Pregunta
Answer.belongsTo(User, {  as: "user", foreignKey: 'user_id' }); // Relación con Usuario

module.exports = Answer;
