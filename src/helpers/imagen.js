const fs = require('fs').promises;
const path = require('path');
const { response } = require('express');
const User = require('../models/user.model');
const Question = require('../models/question.model');
const Choice = require('../models/choice.model');

 

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        // Borrar la imagen anterior
        fs.unlinkSync(path);
    }
}

const uploadImage = async (type, id, fileName) => {
    try {
        let oldPath = '';

        switch (type) {
            case 'questions':
                const q = await Question.findByPk(id);
                if (!q) {
                    console.log('No es una pregunta por id');
                    return false;
                }

                oldPath = `./uploads/questions/${q.img}`;
                deleteImage(oldPath);
                q.img = fileName;
                await q.save();
                return true;

            case 'options':
                const option = await Option.findByPk(id);
                if (!option) {
                    console.log('No es una opción por id');
                    return false;
                }

                oldPath = `./uploads/options/${option.img}`;
                deleteImage(oldPath);
                option.img = fileName;
                await option.save();
                return true;

            case 'users':
                const user = await User.findByPk(id);
                if (!user) {
                    console.log('No es un usuario por id');
                    return false;
                }

                oldPath = `./uploads/users/${user.img}`;
                deleteImage(oldPath);
                user.img = fileName;
                await user.save();
                return true;
            
            // Agregar más casos según sea necesario para otros tipos de actualizaciones

            default:
                console.log('Tipo no válido');
                return false;
        }
    } catch (error) {
        console.log(error);
        return false;
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


 