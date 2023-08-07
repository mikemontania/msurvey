const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generarJWT = async (id) => { 
    try {
        const usuario = await User.findByPk(id, {
            attributes: {
                exclude: ['password']
            }
        });

        const payload = {
            usuario
        };
console.log(payload)
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        console.log(token)

        return token;
    } catch (error) {
        console.log(error);
        throw new Error('Error generating JWT');
    }
};

module.exports = {
    generarJWT,
};
