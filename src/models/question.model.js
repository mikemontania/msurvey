const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const moment = require('moment');
const Survey = require('./survey.model');
const Choice = require('./choice.model');

const Question = sequelize.define('Question', {
  codQuestion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'cod_question', // Utiliza snake_case en la base de datos
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'question_text', // Utiliza snake_case en la base de datos
  },
  questionType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'question_type', // Utiliza snake_case en la base de datos
  },
  obligatory: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'amount', // Utiliza snake_case en la base de datos
  },
  alignment: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'alignment', // Utiliza snake_case en la base de datos
  },
  bold: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'bold', // Utiliza snake_case en la base de datos
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at', // Utiliza snake_case en la base de datos
    get() {
      return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
    },
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
    field: 'updated_at', // Utiliza snake_case en la base de datos
    get() {
      return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'AUTO_GENERADO',
    field: 'updated_by', // Utiliza snake_case en la base de datos
  },
}, {
  tableName: 'questions', // Nombre de la tabla en snake_case
  timestamps: true,
 // Esto convierte los nombres de columnas de camelCase a snake_case
 underscored: true,
 // Esto convierte los nombres de modelos de pascalCase a snake_case
 freezeTableName: true,
});

// Asociaciones de Question
Question.hasMany(Choice, {
   foreignKey: 'codQuestion', // Utiliza snake_case en la base de datos
});

Choice.belongsTo(Question, {
  foreignKey: 'codQuestion', // Utiliza snake_case en la base de datos
});

module.exports = Question;
