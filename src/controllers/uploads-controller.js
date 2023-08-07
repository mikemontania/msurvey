const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/imagen');

const fileUpload = async (req, res = response) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;

        // Validar tipo
        const tiposValidos = ['user', 'question', 'answer']; // Actualiza los tipos según tus necesidades
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                ok: false,
                msg: 'Tipo de entidad no válido'
            });
        }

        // Validar que exista un archivo
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No hay ningún archivo'
            });
        }

        // Procesar la imagen...
        const file = req.files.imagen;

        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        // Validar extension
        const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
        if (!extensionesValidas.includes(extensionArchivo)) {
            return res.status(400).json({
                ok: false,
                msg: 'No es una extensión permitida'
            });
        }

        // Generar el nombre del archivo
        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        // Path para guardar la imagen
        const ruta = `./uploads/${tipo}/${nombreArchivo}`;

        // Mover la imagen
        await file.mv(ruta);

        // Actualizar base de datos
        await actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al mover la imagen'
        });
    }
};

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImgDefault = path.join(__dirname, '../uploads/no-img.jpg');
        res.sendFile(pathImgDefault);
    }
};

module.exports = {
    fileUpload,
    retornaImagen
};
