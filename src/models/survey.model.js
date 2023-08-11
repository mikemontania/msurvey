const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const moment = require('moment');
const User = require('./user.model');
const Question = require('./question.model');

const Survey = sequelize.define('Survey', {
  codSurvey: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'cod_survey', // Utiliza snake_case en la base de datos
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  creationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'creation_date', // Utiliza snake_case en la base de datos
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    },
    field: 'created_at', // Utiliza snake_case en la base de datos
  },
  createdBy: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'AUTO_GENERADO',
    field: 'created_by', // Utiliza snake_case en la base de datos
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
    },
    field: 'updated_at', // Utiliza snake_case en la base de datos
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'AUTO_GENERADO',
    field: 'updated_by', // Utiliza snake_case en la base de datos
  },
}, {
  tableName: 'surveys', // Nombre de la tabla en snake_case
  timestamps: true,
  // Esto convierte los nombres de columnas de camelCase a snake_case
  underscored: true,
  // Esto convierte los nombres de modelos de pascalCase a snake_case
  freezeTableName: true,
});

// Asociaciones de Survey
Survey.hasMany(Question, {
   foreignKey: 'codSurvey', // Utiliza snake_case en la base de datos
});

Question.belongsTo(Survey, {
  foreignKey: 'codSurvey', // Utiliza snake_case en la base de datos
});

module.exports = Survey;
