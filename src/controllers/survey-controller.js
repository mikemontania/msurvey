const { response } = require('express');
const Survey = require('../models/survey.model');
const Question = require('../models/question.model');
const SurveyResponse = require('../models/surveyResponse.model');
const Choice = require('../models/choice.model');
const { sequelize } = require('../../dbconfig');
const associations = require('../models/associations'); // Aquí importas todas las exportaciones del archivo

/**
 * {
  "title": "Encuesta de satisfacción",
  "description": "Por favor, responde las siguientes preguntas.",
  "questions": [
    {
      "questionText": "¿Estás satisfecho con nuestro servicio?",
      "questionType": "multiple_choice",
      "choices": ["Sí", "No"]
    },
    {
      "questionText": "¿Qué aspecto te gustaría que mejoráramos?",
      "questionType": "text"
    },
    {
      "questionText": "¿En una escala del 1 al 5, qué tan probable es que recomiendes nuestro producto?",
      "questionType": "rating",
      "choices": ["1", "2", "3", "4", "5"]
    }
  ]
}
 * * */
const createSurvey = async (req, res) => {
    const t = await sequelize.transaction(); // Iniciar una transacción

    try {
        const { title, description, questions } = req.body;

        // Crear la encuesta
        const survey = await Survey.create({
            title,
            description,
            creationDate: new Date(),
            codUser: req.user.codUser
        }, { transaction: t });

        const createdQuestions = [];

        for (const questionData of questions) {
            // Crear la pregunta dentro de la transacción
            const question = await Question.create({
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                obligatory: questionData.obligatory,
                amount: questionData.amount,
                alignment: questionData.alignment,
                bold: questionData.bold,
                codSurvey: survey.codSurvey
            }, { transaction: t });

            if (questionData.choice && questionData.choice.length > 0) {
                const createdChoices = [];

                for (const choiceData of questionData.choice) {
                    const choice = await Choice.create({
                        choiceType: choiceData.choiceType,
                        choiceText: choiceData.choiceText,
                        codQuestion: question.codQuestion
                    }, { transaction: t });

                    createdChoices.push(choice);
                }

                if (createdChoices.length === 0) {
                    throw new Error('At least one choice is required for each question.');
                }
            } else {
                throw new Error('At least one choice is required for each question.');
            }

            createdQuestions.push(question);
        }

        await t.commit(); // Confirmar la transacción

        res.status(201).json({
            success: true,
            message: 'Survey created successfully with questions and choices',
            survey,
            questions: createdQuestions
        });
    } catch (error) {
        console.error('Error creating survey:', error);
        await t.rollback(); // Revertir la transacción en caso de error
        res.status(500).json({
            success: false,
            message: 'An error occurred while creating the survey',
            error: error.message
        });
    }
};
const getSurveyById = async (req, res) => {
    const codSurvey = req.params.id;
    try {
        const Survey = associations.Survey;
        const Question = associations.Question;

        const survey = await Survey.findOne({
            where: { cod_survey: codSurvey },
            include: [
                {
                    model: Question,
                    include: [
                        {
                            model: associations.Choice
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

            if (questionData.choices) {
                for (const choiceText of questionData.choices) {
                    await Choice.create({
                        choiceText,
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
        const { codUser, codSurvey, codQuestion, codChoice, responses } = req.body;

        // Verificar si todos los campos necesarios están presentes
        if (!codUser || !codSurvey || !codQuestion || !codChoice || !responses) {
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
            codChoice: codChoice,
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
