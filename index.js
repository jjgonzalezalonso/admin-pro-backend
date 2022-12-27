// require  = import express from 'express';
//require('dotenv').config(); // lee el archivo .env

const express= require('express'); // crear Base de Datos
const cors= require('cors');  // Cors
// importa dbConnection
const {dbConnection} = require('./database/config.js');

dbConnection(); // Base de datos
//console.log(process.env);

const app= express(); // Crear el servidor de express
app.use(cors()); // Configurar Cors
// Primero va el servidor y luego el corse
//Rutas
app.get('/', (req,res)=>{
    res.status(400).json({
        ok:true,
        msg:'Hola Mundo'
    });
});

app.listen(3000,()=>{
    console.log('Servidor corriendo en puerto ' + 3000)
});