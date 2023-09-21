const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    createSurvey,
    getSurveys,
    activateSurvey,
    getSurveyById,
    updateSurvey,
    getSurveyResultsById
} = require('../controllers/survey-controller');

const router = Router();
getSurveyResultsById
// Ruta para obtener resultados
router.get('/result/:id', validarJWT,getSurveyResultsById);
// Ruta para obtener todas las encuestas con preguntas y opciones
router.get('/list', validarJWT,getSurveys);
// Obtener una encuesta por ID
router.get('/:id', validarJWT,  getSurveyById);
// Ruta para crear una encuesta
router.post('/create', validarJWT, createSurvey);
// Actualizar una encuesta por ID
router.put('/:id', validarJWT, updateSurvey);

// Ruta para activar una encuesta (puedes ajustar la ruta y la lógica según tus necesidades)
router.put('/activate/:id', validarJWT, activateSurvey);

module.exports = router;
