const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generarJWT = async (codUser) => {
    console.log('generarJWT')
    console.log(codUser)
    try {
        const user = await User.findByPk(codUser, {
            attributes: {
                exclude: ['password']
            }
        });

        const payload = {
            user
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
