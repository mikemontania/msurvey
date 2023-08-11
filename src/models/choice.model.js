const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const moment = require('moment');
const Question = require('./question.model');

const Choice = sequelize.define('Choice', {
  codChoice: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  choiceType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'choice_type',
  },
  choiceText: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'choice_text',
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  createdBy: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'AUTO_GENERADO',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'AUTO_GENERADO',
  },
}, {
  tableName: 'choices', // Nombre de la tabla en snake_case
  timestamps: true,
 // Esto convierte los nombres de columnas de camelCase a snake_case
 underscored: true,
 // Esto convierte los nombres de modelos de pascalCase a snake_case
 freezeTableName: true,
});

module.exports = Choice;
