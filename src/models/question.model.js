const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Survey = require('./survey.model');

class Question extends Model {}

Question.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questionType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Question',
  tableName: 'questions',
  timestamps: false
});

Question.belongsTo(Survey, { as: "survey",  foreignKey: 'survey_id' }); // Relación con Encuesta

module.exports = Question;
