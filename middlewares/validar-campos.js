const { response } = require('express'); // para tener el tipado del res
const { validationResult } = require('express-validator')

const validarCampos = (req, res = response, next ) => {
    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    next(); // Si llega aqui es que no hay errores
}

module.exports = {
    validarCampos
}
    // YO HABIA UTILIZADO ASI, EN VEZ DE MAPPED()
    // const errores = validationResult(req); // lista de todos los errores
    // if (!errores.isEmpty()){
    //     return res.status(400).json({errores: errores.array()});
    // }