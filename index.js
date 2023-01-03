require('dotenv').config(); // lee el archivo .env

const express= require('express'); // crear Base de Datos
const cors= require('cors');  // Cors
// importa dbConnection
const {dbConnection} = require('./database/config.js');

dbConnection(); // Base de datos
console.log(process.env.PORT); // 3000

const app= express(); // Crear el servidor de express
app.use(cors()); // Configurar Cors
// Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos') );
app.use('/api/todo', require('./routes/busquedas') );
app.use('/api/login',require('./routes/auth'));
app.use('/api/upload',require('./routes/uploads'));

app.listen(3000,()=>{
    console.log('Servidor corriendo en puerto ' + 3000)
});