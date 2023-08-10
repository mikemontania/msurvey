const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const Question = require('./question.model');
const moment = require('moment');

class Choice extends Model { }

Choice.init({
  codChoice: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    unique: true, 
    field: 'cod_choice'
  },
  choiceType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'choice_type'
  },
  choiceText: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'choice_text'
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'img'
  },
  codQuestion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'cod_question',
    references: {
      model: Question, // Usa la instancia del modelo Question aquí
      key: 'cod_question'
    },
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
  modelName: 'Choice',
  tableName: 'choices',
  scopes: {
    withPassword: {
      attributes: {},
    }
  },
  timestamps: true,
  underscored: true,
});


module.exports = Choice;
