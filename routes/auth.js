/*
    Ruta /api/login
*/
const {Router}=require('express');
const{login} =require('../controllers/auth'); // importamos el controlador
const {body}=require('express-validator');
const {validarCampos}=require('../middlewares/validar-campos');

const router = Router();

router.post('/',[
    body('password','El password es obligatorio').not().isEmpty(),
    body('email', 'El email es obligatorio').isEmail(),
    validarCampos,
], login);

module.exports=router;