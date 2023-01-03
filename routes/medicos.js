/*
    Medicos
    ruta: '/api/medicos'
*/
const { Router } = require('express');
const { body} = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
} = require('../controllers/medicos')

const router = Router();

router.get( '/', getMedicos );

router.post( '/',
    [
        validarJWT,
        body('nombre','El nombre del medico es obligatorio').not().isEmpty(),
        body('hospital','El hospital id debe de ser valido').isMongoId(),
        validarCampos
    ], 
    crearMedico 
);

router.put( '/:id',
    [],
    actualizarMedico
);

router.delete( '/:id',
    borrarMedico
);

module.exports = router;



