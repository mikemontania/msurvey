const express = require('express');
const { getSurveyById } = require('../controllers/survey-controller');
const router = express.Router();

router.get('/:id', getSurveyById);

module.exports = router;