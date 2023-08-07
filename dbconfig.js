const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_CNN, {
    logging: false, //default true
    pool: {
        max: 5,
        idle: 30000,
        require: 60000,
    }
});

const dbConnection = async () => {
    try {
        await sequelize.authenticate();
        // afecta la BD segun el modelo,
        // el modelo debe declararse algun archivo .js
        //crea si no existe
         await sequelize.sync();
         //destruye y vuelve a crear  
       //  await sequelize.sync({ force: true });
        console.log('Conectado a la BD: %j', process.env.DB_CNN);
    } catch (error) {
        console.error(error);
        throw new Error('Error al conectarse a la BD');
    }
}

module.exports = {
    sequelize,
    dbConnection
}