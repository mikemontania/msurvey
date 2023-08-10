const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');
const User = require('./user.model');
const Question = require('./question.model');
const Survey = require('./survey.model');
const Choice = require('./choice.model');
const moment = require('moment');

class SurveyResponse extends Model { }

SurveyResponse.init({
    codSurveyResponse: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true, 
        field: 'cod_survey_response' // Nombre de columna en snake_case para la base de datos
    },
    codUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cod_user' // Nombre de columna en snake_case para la base de datos
    },
    codSurvey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cod_survey' // Nombre de columna en snake_case para la base de datos
    },
    codQuestion: {
        type: DataTypes.INTEGER, // Cambiar al tipo de dato correcto
        allowNull: false,
        field: 'cod_question' // Nombre de columna en snake_case para la base de datos
    },
    codChoice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cod_choice' // Nombre de columna en snake_case para la base de datos
    },
    responses: {
        type: DataTypes.JSON, // O un tipo de dato adecuado para tus respuestas
        allowNull: false
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
    modelName: 'SurveyResponse',
    tableName: 'survey_responses', // Nombre de tabla en plural y minúsculas
    scopes: {
        withPassword: {
            attributes: {},
        }
    },
    timestamps: true,
    underscored: true,
});


module.exports = SurveyResponse;
