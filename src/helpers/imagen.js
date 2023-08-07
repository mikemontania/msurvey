const fs = require('fs').promises;
const path = require('path');
const { response } = require('express');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

const uploadImage = async (req, res = response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                msg: 'No se proporcionó ninguna imagen'
            });
        }

        const { entityId, entityType } = req.body; // Recibir el ID y tipo de entidad desde la solicitud

        let entity;

        switch (entityType) {
            case 'user':
                entity = await User.findByPk(entityId);
                break;
            case 'question':
                entity = await Question.findByPk(entityId);
                break;
            case 'answer':
                entity = await Answer.findByPk(entityId);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Tipo de entidad no válido'
                });
        }

        if (!entity) {
            return res.status(404).json({
                ok: false,
                msg: 'Entidad no encontrada'
            });
        }

        // Obtener la ruta de la carpeta para la entidad
        const entityFolder = entityType === 'user' ? 'usuarios' : entityType === 'question' ? 'preguntas' : 'respuestas';

        // Borrar imagen anterior si existe
        if (entity.img) {
            const imagePath = path.join(__dirname, `../uploads/${entityFolder}/${entity.img}`);
            await fs.unlink(imagePath);
        }

        // Asignar nueva imagen a la entidad
        entity.img = req.file.filename;
        await entity.save();

        res.status(200).json({
            ok: true,
            msg: `Imagen de ${entityType} actualizada`
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno, verifique log'
        });
    }
};
 
const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
    }
}

const getImage = async (req, res = response) => {
    try {
        const userId = req.params.id; // Obtener el ID del usuario desde los parámetros de la URL
        const usuario = await User.findByPk(userId);

        if (!usuario || !usuario.img) {
            return res.status(404).json({
                ok: false,
                msg: 'Imagen no encontrada'
            });
        }

        const imagePath = path.join(__dirname, `../uploads/usuarios/${usuario.img}`);
        res.sendFile(imagePath);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno, verifique log'
        });
    }
};

module.exports = {
    uploadImage,
    borrarImagen,
    getImage
};    


 