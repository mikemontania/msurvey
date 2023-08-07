const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../dbconfig');

class SurveyResponse extends Model {}

SurveyResponse.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    surveyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    responses: {
        type: DataTypes.JSON, // O un tipo de dato adecuado para tus respuestas
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'SurveyResponse',
    tableName: 'survey_responses',
    timestamps: true
});
SurveyResponse.belongsTo(Survey, { as: "survey",  foreignKey: 'survey_id' }); // Relación con encuesta
SurveyResponse.belongsTo(Answer, {  as: "answer", foreignKey: 'answer_id' }); // Relación con respuesta
SurveyResponse.belongsTo(User, { as: "user",  foreignKey: 'user_id' }); // Relación con Usuario
module.exports = SurveyResponse;
