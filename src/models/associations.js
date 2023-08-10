const User = require('./user.model');
const Question = require('./question.model');
const Survey = require('./survey.model');
const Choice = require('./choice.model');
const SurveyResponse = require('./surveyResponse.model');

Question.belongsTo(Survey, { as: "survey", foreignKey:{ name: "cod_survey", allowNull: false } });
Survey.hasMany(Question, {as: "questions", foreignKey: { name: "cod_survey", allowNull: false }});

Question.belongsTo(Choice, { as: "choices", foreignKey:{ name: "cod_question", allowNull: false } });
Choice.belongsTo(Question, { as: "question", foreignKey:{ name: "cod_question", allowNull: false } });

 


Survey.belongsTo(User, { as: "user", foreignKey:{ name:"cod_user", allowNull: false } });

SurveyResponse.belongsTo(User, { as: "user", foreignKey:{ name:"cod_user", allowNull: false } });
SurveyResponse.belongsTo(Question, { as: "question", foreignKey:{ name: "cod_question", allowNull: false } });
SurveyResponse.belongsTo(Survey, { as: "survey", foreignKey: { name: "cod_survey", allowNull: false } });
SurveyResponse.belongsTo(Choice, { as: "choice", foreignKey: { name: "cod_choice", allowNull: false } });

module.exports = {
    User,
    Question,
    Survey,
    Choice,
    SurveyResponse
};

