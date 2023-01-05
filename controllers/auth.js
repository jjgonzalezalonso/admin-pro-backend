const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {response} = require('express');  // para tener las ayudas del res
const {generarJWT}=require('../helpers/jwt.js');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSingIn = async(req,res=response)=>{
    try {
        // const googleUser=await googleVerify(req.body.token);
        const { email, name, picture }=await googleVerify(req.body.token);
        const usuarioDB = await Usuario.findOne({ email }); // existe el email?
        let usuario;

        if ( !usuarioDB ) { // creo el nuevo usuario
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@', // no lo usamos para nada
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = '@@';
        }

        await usuario.save();// a algunos les funciona sin poner ()

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            //email, name, picture,
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token de Google incorrecto'
        });
    }
}

module.exports={login, googleSingIn}