const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Survey = require('./survey.model');
const moment = require('moment'); 
 
class Question extends Model { }

Question.init({
  codQuestion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true, 
    field: 'cod_question',
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
  obligatory: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  amount : {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'amount'
  },
  alignment: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'alignment'
  },
  bold: {
    type: DataTypes.STRING,
    allowNull: true,
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

module.exports = Question;
