const { response } = require('express');
const Survey = require('../models/survey.model');
const Question = require('../models/question.model');
const Option = require('../models/opcion.model');
const Answer = require('../models/answer.model');

const createSurvey = async (req, res = response) => {
    try {
        const { title, description, questions } = req.body;

        const survey = await Survey.create({
            title,
            description,
            creationDate: new Date(),
            creatorUserId: req.user.id // Assuming you have authentication middleware
        });

        const createdQuestions = [];

        for (const questionData of questions) {
            const question = await Question.create({
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                surveyId: survey.id
            });

            if (questionData.options) {
                for (const optionText of questionData.options) {
                    await Option.create({
                        optionText,
                        questionId: question.id
                    });
                }
            }

            createdQuestions.push(question);
        }

        res.status(201).json({
            ok: true,
            survey,
            questions: createdQuestions
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
};
 

const getSurveys = async (req, res = response) => {
    try {
      const surveys = await Survey.findAll({
        include: [
          {
            model: Question,
            include: Option // Incluye las opciones si es necesario
          }
        ]
      });
  
      res.status(200).json({
        ok: true,
        surveys
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Internal error, check log'
      });
    }
};

// Implement activation logic according to your requirements
const activateSurvey = async (req, res = response) => {
    // Implement activation logic here
};

const createSurveyResponse = async (req, res = response) => {
    try {
        const { responses } = req.body;

        // Verificar si las encuestas existen y obtener información de preguntas
        const surveysMap = new Map(); // Usar un mapa para almacenar la información de las encuestas
        const questionIds = [];

        for (const responseItem of responses) {
            const surveyId = responseItem.surveyId;

            if (!surveysMap.has(surveyId)) {
                const survey = await Survey.findByPk(surveyId, {
                    include: {
                        model: Question,
                        include: Option
                    }
                });

                if (!survey) {
                    return res.status(404).json({
                        ok: false,
                        msg: `Survey with id ${surveyId} not found`
                    });
                }

                surveysMap.set(surveyId, survey);
            }

            const questionId = responseItem.questionId;
            questionIds.push(questionId);
        }

        // Verificar si las preguntas existen
        const questions = await Question.findAll({
            where: {
                id: questionIds
            }
        });

        if (questions.length !== questionIds.length) {
            return res.status(404).json({
                ok: false,
                msg: 'Some questions not found'
            });
        }

        // Crear respuestas para las encuestas
        const createdResponses = [];

        for (const responseItem of responses) {
            const survey = surveysMap.get(responseItem.surveyId);
            const question = questions.find(q => q.id === responseItem.questionId);

            const answer = await Answer.create({
                surveyId: responseItem.surveyId,
                questionId: responseItem.questionId,
                optionId: responseItem.optionId,
                answerText: responseItem.answerText
            });

            createdResponses.push({
                survey,
                question,
                answer
            });
        }

        res.status(201).json({
            ok: true,
            msg: 'Survey responses created successfully',
            responses: createdResponses
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal error, check log'
        });
    }
};

module.exports = {
    createSurvey,
    getSurveys,
    activateSurvey,
    createSurveyResponse
};
