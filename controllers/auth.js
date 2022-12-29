const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {response} = require('express');  // para tener las ayudas del res
const {generarJWT}=require('../helpers/jwt.js');

const login = async(req,res=response)=>{
    const { email, password } = req.body;

    try {
        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            });
        }
        // Generar un TOKENS - JWT json web token
        // await porque genera una promesa
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok:true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'login - Error inesperado...'
        })
    }
}

module.exports={login}