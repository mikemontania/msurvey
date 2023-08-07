const User = require('./src/models/user.model'); 
const Bcryptjs = require('bcryptjs');

const populateDB = async () => {
    console.log('populateDB')
    if (process.env.DB_INIT == 'true') {
        console.log('Inicializando registros en DB!');
        const salt = Bcryptjs.genSaltSync();
        const userAdmin = await User.create({
            id:null,
            name: 'admin',
            username: 'admin@admin.com',
            password: Bcryptjs.hashSync('123', salt),
            img: '', 
            role: '', 
            attempts: 0,
            active: true,
            blocked: false

        });
        const userAdmin2 = await User.create({
            id:null,
            name: 'Miguel Montania',
            username: 'miguel.montania@cavallaro.com.py',
            password: Bcryptjs.hashSync('Cavainfo.MM', salt),
            img: '', 
            role: '', 
            attempts: 0,
            active: true,
            blocked: false

        });
    }
}

module.exports = { populateDB };