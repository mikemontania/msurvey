require ('dotenv').config();
const { populateDB } = require('./dbinit');

const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./dbconfig');
const morgan = require('morgan');
const { json } = require('express/lib/response');

// Crear el servidor de express
const app = express(); 
//middlewares
app.use( morgan('dev'));
app.use( express.json());
// Configurar CORS
app.use(cors()); 


// Base de datos
const dbSetup = async ()=>{
    //crea conexion
    await dbConnection();
    //inserta registros
    await populateDB();
}
dbSetup();


app.use( '/msurvey/auth', require('./src/routes/auth-routes'));
app.use( '/msurvey/user', require('./src/routes/user-routes'));
app.use( '/msurvey/uploads', require('./src/routes/uploads-routes')); 
app.use( '/msurvey/survey', require('./src/routes/survey-routers')); 

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});
