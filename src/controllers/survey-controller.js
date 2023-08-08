const { response } = require('express');
const Survey = require('../models/survey.model');
const Question = require('../models/question.model');
const SurveyResponse = require('../models/surveyResponse.model');
const Answer = require('../models/answer.model');
/**
 * {
  "title": "Encuesta de satisfacción",
  "description": "Por favor, responde las siguientes preguntas.",
  "questions": [
    {
      "questionText": "¿Estás satisfecho con nuestro servicio?",
      "questionType": "multiple_choice",
      "answers": ["Sí", "No"]
    },
    {
      "questionText": "¿Qué aspecto te gustaría que mejoráramos?",
      "questionType": "text"
    },
    {
      "questionText": "¿En una escala del 1 al 5, qué tan probable es que recomiendes nuestro producto?",
      "questionType": "rating",
      "answers": ["1", "2", "3", "4", "5"]
    }
  ]
}
 * * */
const createSurvey = async (req, res) => {
    try {
        const { title, description, questions } = req.body;

        // Crear la encuesta
        const survey = await Survey.create({
            title,
            description,
            creationDate: new Date(),
            codUser: req.user.codUser // Cambiar al nombre correcto de la columna
        });

        // Crear preguntas y respuestas para la encuesta
        const createdQuestions = [];

        for (const questionData of questions) {
            // Crear la pregunta
            const question = await Question.create({
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                codSurvey: survey.codSurvey // Cambiar al nombre correcto de la columna
            });

            if (questionData.answers) {
                for (const answerText of questionData.answers) {
                    // Crear la respuesta asociada a la pregunta
                    await Answer.create({
                        answerText,
                        codQuestion: question.codQuestion // Cambiar al nombre correcto de la columna
                    });
                }
            }

            createdQuestions.push(question);
        }

        res.status(201).json({
            success: true,
            message: 'Survey created successfully with questions and answers',
            survey,
            questions: createdQuestions
        });
    } catch (error) {
        console.error('Error creating survey:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the survey',
            error: error.message
        });
    }
};
const getSurveyById = async (req, res) => {
    const surveyId = req.params.id; // ID de la encuesta pasado como parámetro en la URL

    try {
        const survey = await Survey.findByPk(surveyId, {
            include: [
                {
                    model: Question,
                    as: 'questions',
                    include: [
                        {
                            model: Answer,
                            as: 'answers'
                        }
                    ]
                }
            ]
        });

        if (!survey) {
            return res.status(404).json({ message: 'Encuesta no encontrada' });
        }

        return res.status(200).json({ survey });
    } catch (error) {
        console.error('Error al obtener la encuesta por ID:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
const updateSurvey = async (req, res) => {
    try {
        const surveyId = req.params.id; // Obtener el ID de la encuesta a actualizar
        const { title, description, questions } = req.body;

        // Buscar la encuesta existente por ID
        const survey = await Survey.findByPk(surveyId);

        if (!survey) {
            return res.status(404).json({ message: 'Encuesta no encontrada' });
        }

        // Actualizar la encuesta con los nuevos datos
        await survey.update({
            title,
            description
        });

        // Eliminar preguntas y respuestas existentes de la encuesta
        await Question.destroy({ where: { codSurvey: surveyId } });

        // Crear nuevas preguntas y respuestas para la encuesta actualizada
        const updatedQuestions = [];

        for (const questionData of questions) {
            const question = await Question.create({
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                codSurvey: surveyId
            });

            if (questionData.answers) {
                for (const answerText of questionData.answers) {
                    await Answer.create({
                        answerText,
                        codQuestion: question.codQuestion
                    });
                }
            }

            updatedQuestions.push(question);
        }

        res.status(200).json({
            success: true,
            message: 'Encuesta actualizada con éxito con preguntas y respuestas',
            survey,
            questions: updatedQuestions
        });
    } catch (error) {
        console.error('Error al actualizar la encuesta:', error);
        res.status(500).json({
            success: false,
            message: 'Se produjo un error al actualizar la encuesta',
            error: error.message
        });
    }
};
const getSurveys = async (req, res = response) => {
    try {
        const surveys = await Survey.findAll();

        const surveysWithQuestions = [];

        for (const survey of surveys) {
            const questions = await Question.findAll({
                where: { cod_survey: survey.codSurvey } // Cambiar el nombre de columna si es necesario
            });

            const surveyWithQuestions = survey.toJSON();
            surveyWithQuestions.questions = questions;

            surveysWithQuestions.push(surveyWithQuestions);
        }

        res.status(200).json({
            ok: true,
            surveys: surveysWithQuestions
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
    try {
        const { surveyId } = req.params;

        // Buscar la encuesta por su ID
        const survey = await Survey.findByPk(surveyId);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        // Cambiar el estado de activación
        survey.active = !survey.active;
        await survey.save();

        const newStatus = survey.active ? 'active' : 'inactive';

        return res.status(200).json({
            success: true,
            message: `Survey is now ${newStatus}`,
            survey
        });
    } catch (error) {
        console.error('Error activating survey:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while activating the survey',
            error: error.message
        });
    }
};


const createSurveyResponse = async (req, res) => {
    try {
        const { codUser, codSurvey, codQuestion, codAnswer, responses } = req.body;

        // Verificar si todos los campos necesarios están presentes
        if (!codUser || !codSurvey || !codQuestion || !codAnswer || !responses) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Crear la respuesta de encuesta en la base de datos
        const surveyResponse = await SurveyResponse.create({
            codUser: codUser,
            codSurvey: codSurvey,
            codQuestion: codQuestion,
            codAnswer: codAnswer,
            responses
        });

        return res.status(201).json({
            success: true,
            message: 'SurveyResponse created successfully',
            data: surveyResponse
        });
    } catch (error) {
        console.error('Error creating SurveyResponse:', error);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while creating the SurveyResponse',
            error: error.message
        });
    }
}

module.exports = {
    createSurvey,
    getSurveys,
    activateSurvey,
    getSurveyById,
    createSurveyResponse,
    updateSurvey
};
