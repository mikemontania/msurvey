const { response } = require('express');
const Survey = require('../models/survey.model');
const Question = require('../models/question.model');
const SurveyResponse = require('../models/surveyResponse.model');
const Choice = require('../models/choice.model');
const { sequelize } = require('../../dbconfig');

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
    console.log(req.user)
    try {
        const { title, description, Questions } = req.body;
        console.log('Questions xxxx')

        // Crear la encuesta
        const survey = await Survey.create({
            title,
            description,
            creationDate: new Date(),
            codUser: req.user.codUser
        }, { transaction: t });

        const createdQuestions = [];
        console.log(Questions)
        for (const questionData of Questions) {
            console.log('let questionData:', questionData);

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
            console.log(question)
            if (questionData.Choices && questionData.Choices.length > 0) {
                const createdChoices = [];

                console.log('let question:', questionData);
                for (const choiceData of questionData.Choices) {
                    const choice = await Choice.create({
                        choiceType: choiceData.choiceType,
                        choiceText: choiceData.choiceText,
                        codQuestion: question.dataValues.codQuestion
                    }, { transaction: t });
                    console.log('createdChoices:', createdChoices);
                    createdChoices.push(choice);
                }
                console.log('createdChoices:', createdChoices);

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



const createSurveyResponses = async (req, res) => {
    const surveyResponses = req.body; // Array de surveyResponses

    try {
        // Crea una transacción para garantizar la consistencia de la base de datos
        await sequelize.transaction(async (transaction) => {
            // Crea cada una de las surveyResponses
            for (const response of surveyResponses) {
                await SurveyResponse.create(response, { transaction });
            }
        });

        return res.status(201).json({ message: 'SurveyResponses creadas con éxito' });
    } catch (error) {
        console.error('Error al crear SurveyResponses:', error);
        return res.status(500).json({ message: 'Error al crear SurveyResponses' });
    }
};

const getSurveyById = async (req, res) => {
    const codSurvey = req.params.id;
    try {


        const survey = await Survey.findOne({
            where: { codSurvey: codSurvey },
            include: [
                {
                    model: Question,
                    include: [
                        {
                            model: Choice
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
const getSurveyResultsById = async (req, res) => {
    const codSurvey = req.params.id;
    try {
        const surveyData = await Survey.findOne({
            where: { codSurvey: codSurvey },
            include: [{ model: Question }],
        });
        if (!surveyData) {
            return res.status(404).json({ message: 'Encuesta no encontrada' });
        }

        // Crear una copia personalizada del objeto surveyData sin incluir las propiedades problemáticas
        let survey = {
            codSurvey: surveyData.dataValues.codSurvey,
            title: surveyData.dataValues.title,
            description: surveyData.dataValues.description,
            // Agrega las propiedades que necesites aquí
            questions: [],
        };

        if (surveyData.dataValues && surveyData.dataValues.Questions) {
            // Crear un array de promesas para todas las operaciones asincrónicas
            const promises = surveyData.dataValues.Questions.map(async questionData => {
                let question = {
                    codQuestion: questionData.dataValues.codQuestion,
                    questionText: questionData.dataValues.questionText,
                    questionType: questionData.dataValues.questionType,
                    // Agrega las propiedades que necesites aquí
                    resultsText: null,
                    resultChartChoices: null,
                    resultChartValue: null,
                    resultAverage: null,
                };

                switch (questionData.dataValues.questionType) {
                    case 'INPUT':
                    case 'TEXTAREA':
                    case 'MAPA':
                        question.resultsText = await getResultText(questionData.dataValues.codQuestion);
                        break;
                    case 'CHECKBOX':
                    case 'RADIOBUTTON':
                        question.resultChartChoices = await getResultChartChoices(questionData.dataValues.codQuestion);
                        break;
                    case 'RANGE':
                    case 'CARITAS':
                        question.resultChartValue = await getResultChartValue(questionData.dataValues.codQuestion);
                        break;
                    case 'STARS':
                        question.resultAverage = await getResultAverage(questionData.dataValues.codQuestion);
                        break;
                    default:
                        console.log('sin opcion')
                        break;
                }

                return question;
            });

            // Esperar a que todas las operaciones asincrónicas se completen
            const questionResults = await Promise.all(promises);

            // Agregar los resultados al objeto survey
            survey.questions = questionResults;
        }

        return res.status(200).json(survey);
    } catch (error) {
        console.error('Error al obtener la encuesta por ID:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const getResultText = async (codQuestion) => {
    try {
        const responses = await SurveyResponse.findAll({
            where: { codQuestion: codQuestion },
        });

        return responses.map(response => {
            return {
                client: response.client,
                data: response.response
            };
        });
    } catch (error) {
        console.error('Error al obtener las respuestas de texto:', error);
        throw error;
    }
};
const getResultChartChoices = async (codQuestion) => {
    try {
        const responses = await SurveyResponse.findAll({
            where: { codQuestion: codQuestion },
            attributes: ['response'],
        });

        // Función auxiliar para crear objetos de elección
        const createChoiceObject = async (response) => {
            const choiceID = +response.dataValues.response;
            const choiceData = await Choice.findOne({ where: { codChoice: choiceID } });
            if (choiceData) {
                const choice = choiceData.dataValues;
                return {
                    id: choiceID,
                    descripcion: choice.choiceText,
                    cantidad: 1,
                };
            }
            return null;
        };

        // Mapear las respuestas a objetos de elección y filtrar los valores nulos
        const choiceObjects = await Promise.all(responses.map(createChoiceObject));
        const validChoiceObjects = choiceObjects.filter((choiceObject) => choiceObject !== null);

        // Agrupar objetos de elección por ID y sumar las cantidades
        const result = {};
        validChoiceObjects.forEach((choiceObject) => {
            const { id, descripcion } = choiceObject;
            if (!result[id]) {
                result[id] = choiceObject;
            } else {
                result[id].cantidad++;
            }
        });

        // Convertir el objeto result en un array de objetos
        const resultArray = Object.values(result);

        return resultArray;
    } catch (error) {
        console.error('Error al obtener los resultados de selección múltiple:', error);
        throw error;
    }
};
const getResultChartValue = async (codQuestion) => {
    try {
        const responses = await SurveyResponse.findAll({
            where: { codQuestion: codQuestion },
            attributes: ['response'],
        });

        // Usar reduce para contar las respuestas de cada valor
        const result = responses.reduce((accumulator, response) => {
            const value = response.response.toString();
            const existingEntry = accumulator.find(entry => entry.descripcion === value);

            if (existingEntry) {
                existingEntry.cantidad++;
            } else {
                accumulator.push({ descripcion: value, cantidad: 1 });
            }

            return accumulator;
        }, []);

        return result;
    } catch (error) {
        console.error('Error al obtener los resultados de valor numérico:', error);
        throw error;
    }
};

const getResultAverage = async (codQuestion) => {
    // para las estrellas creo que hay que obtener el promedio de surveyResponse.response
    try {
        const responses = await SurveyResponse.findAll({
            where: { codQuestion: codQuestion },
            attributes: ['response'],
        });

        // Calcular el promedio
        const totalResponses = responses.length;
        const totalValues = responses.reduce((sum, response) => sum + parseInt(response.response), 0);

        if (totalResponses === 0) {
            return 0; // Evitar división por cero
        }

        const average = totalValues / totalResponses;
        const roundedAverage = Math.round(average); // Redondear al valor entero más cercano

        return roundedAverage;
    } catch (error) {
        console.error('Error al obtener el promedio de respuestas de estrellas:', error);
        throw error;
    }
};

const updateSurvey = async (req, res) => {
    try {
        const codSurvey = req.params.id; // Obtener el ID de la encuesta a actualizar
        const { title, description, questions } = req.body;

        // Buscar la encuesta existente por ID
        const survey = await Survey.findByPk(codSurvey);

        if (!survey) {
            return res.status(404).json({ message: 'Encuesta no encontrada' });
        }

        // Actualizar la encuesta con los nuevos datos
        await survey.update({
            title,
            description
        });

        // Eliminar preguntas y respuestas existentes de la encuesta
        await Question.destroy({ where: { codSurvey: codSurvey } });

        // Crear nuevas preguntas y respuestas para la encuesta actualizada
        const updatedQuestions = [];

        for (const questionData of questions) {
            const question = await Question.create({
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                codSurvey: codSurvey
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

        let surveysWithQuestions = [];

        for (const survey of surveys) {
            console.log(survey)
            const questions = await Question.findAll({
                where: { cod_survey: survey.codSurvey }
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
    updateSurvey,
    createSurveyResponses,
    getSurveyResultsById
};
