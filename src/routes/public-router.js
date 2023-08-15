const express = require('express');
const { getSurveyById ,createSurveyResponses} = require('../controllers/survey-controller');
const router = express.Router();

router.get('/:id', getSurveyById);
router.post('/create', createSurveyResponses);
 
module.exports = router;