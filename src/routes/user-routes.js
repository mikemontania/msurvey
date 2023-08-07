const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')
const {    getUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser } = require('../controllers/user-controller');
const router = Router();
/*
RUTA  /api/usuarios
*/
router.get('/',validarJWT,  getUsers);
router.get('/:id',validarJWT,  getUserById);
router.put('/:id',
    [ validarJWT,
        check('username', 'El username es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], updateUser);
router.post('/',
    [ validarJWT,
        check('username', 'El username es obligatorio').isEmail(),
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ], createUser);
router.delete('/:id',validarJWT,  deleteUser);
module.exports = router;
