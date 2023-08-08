const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Survey = require('./survey.model');

class Question extends Model { }

Question.init({
  codQuestion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    field: 'cod_question'
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'question_text'
  },
  questionType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'question_type'
  },
  alignment: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'alignment'
  },
  bold: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'bold'
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  codSurvey: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cod_survey',
    references: {
      model: Survey,
      key: 'cod_survey'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  createdBy: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'AUTO_GENERADO'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'AUTO_GENERADO'
  },
}, {
  sequelize,
  modelName: 'Question',
  tableName: 'questions',
  scopes: {
    withPassword: {
      attributes: {},
    }
  },
  timestamps: true,
  underscored: true,
});

Question.belongsTo(Survey, { as: "survey", foreignKey: "cod_survey" });

module.exports = Question;
