const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads-controller');

const router = Router();

// Permite cargar el archivo
router.use(expressFileUpload());

// Ruta para cargar una imagen
router.put('/:tipo/:id', validarJWT, fileUpload);

// Ruta para obtener una imagen
router.get('/:tipo/:foto', retornaImagen);

module.exports = router;
