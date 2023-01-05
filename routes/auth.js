/*
    Ruta /api/login
*/
const {Router}=require('express');
const{login,googleSingIn,renewToken} =require('../controllers/auth'); // importamos el controlador
const {body}=require('express-validator');
const {validarCampos}=require('../middlewares/validar-campos');
const {validarJWT}=require('../middlewares/validar-jwt');

const router = Router();

router.post('/',[
    body('password','El password es obligatorio').not().isEmpty(),
    body('email', 'El email es obligatorio').isEmail(),
    validarCampos,
], login);

router.post('/google',[
    body('token','El token de google es obligatorio').not().isEmpty(),
    validarCampos,
], googleSingIn);

router.get('/renew',[
   validarJWT ,
], renewToken);


module.exports=router;