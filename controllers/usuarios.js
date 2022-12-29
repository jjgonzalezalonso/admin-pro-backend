const Usuario = require('../models/usuario');
const {response} = require('express'); // para el res
const bcrypt = require ('bcryptjs'); // todo el paquete
const {generarJWT}=require('../helpers/jwt.js');

const getUsuarios=async(req,res)=>{
    const usuarios = await Usuario.find({},'nombre email role google');
    res.json({
        ok:true,
        usuarios,
       // uid:req.uid
    });
}

const crearUsuario = async(req,res=response)=>{
    const {email,password,nombre} = req.body;
    try {
        const existeEmail= await Usuario.findOne({email});
        if (existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya esta registrado'
            })
        }
        const usuario = new Usuario (req.body);
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync(); // genera un numero al azar
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();
        // Generar un TOKENS - JWT json web token
        // await porque genera una promesa
        const token = await generarJWT(usuario.id);
        res.json({
            ok:true,
            usuario,
            token
        });
    } catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'crearUsuario - Error inesperado...'
        })
    }
}

const actualizarUsuario = async(req,res=response)=>{
    // TODO: Validar token y comprobar que es el usuario correcto
    const uid = req.params.id;
    //const {nombre, email} = req.body; // desestructuramos
    try { 
        const usuarioDB = await Usuario.findById( uid );
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con ese id'
            });
        }
       
        // Actualizaciones
        const {password,google,email, ...campos} = req.body; 
        // desestructuro, los campos password, google, email EXISTEN
        // peroy no están en ...campos
        
        if(usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                // el correo ya exite en la base de datos
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email=email;
        const usuarioActualizado=await Usuario.findByIdAndUpdate(uid,campos,{new: true});
        // new: true para que me devuelva el nuevo usuario, si no aparece el viejo.

        res.json({
            ok:true,
            usuario: usuarioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'actualizarUsuario - Error inesperado...'
        });
    }
}

const borrarUsuario = async(req,res=response)=>{
    const uid = req.params.id;
    try { 
        const usuarioDB = await Usuario.findById( uid );
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'No existe un usuario con ese id'
            });
        }
       
        await Usuario.findByIdAndDelete(uid);
    
        res.json({
            ok:true,
            msg:'Usuario eliminado...'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'borrarUsuario - Error inesperado...'
        });
    }
}
module.exports={
    getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario
}
