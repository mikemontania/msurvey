const { DataTypes } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const moment = require('moment');
const User = require('./user.model');
const Question = require('./question.model');
const Survey = require('./survey.model');
const Choice = require('./choice.model');

const SurveyResponse = sequelize.define('SurveyResponse', {
    codSurveyResponse: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'cod_survey_response', // Utiliza snake_case en la base de datos
    },
    responses: {
        type: DataTypes.JSON,
        allowNull: false,
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
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: 'surveys_responses', // Nombre de la tabla en snake_case
    timestamps: true,
   // Esto convierte los nombres de columnas de camelCase a snake_case
   underscored: true,
   // Esto convierte los nombres de modelos de pascalCase a snake_case
   freezeTableName: true,
});

// Asociaciones de SurveyResponse
SurveyResponse.belongsTo(User, {
     foreignKey: { name: 'codUser', allowNull: false }, // Utiliza snake_case en la base de datos
});

SurveyResponse.belongsTo(Question, {
     foreignKey: { name: 'codQuestion', allowNull: false }, // Utiliza snake_case en la base de datos
});

SurveyResponse.belongsTo(Survey, {
     foreignKey: { name: 'codSurvey', allowNull: false }, // Utiliza snake_case en la base de datos
});

SurveyResponse.belongsTo(Choice, {
     foreignKey: { name: 'codChoice', allowNull: false }, // Utiliza snake_case en la base de datos
});

module.exports = SurveyResponse;
