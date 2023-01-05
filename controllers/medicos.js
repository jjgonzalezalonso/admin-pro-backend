const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {
    const medicos = await Medico.find()
                            .populate('usuario','nombre img')
                            .populate('hospital','nombre img');
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async(req, res = response) => {
    const uid = req.uid;  // se obtiene al pasar la validación del token

    const medico = new Medico({ 
        usuario: uid,
        //hospital:'63b05920accda435c81f7bed',  // id del hospital
        ...req.body  // por ahora solo recibo el nombre
    });

    try {
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error crearMedico'
        });
    }
}
const actualizarMedico = async(req, res = response) => {
    const id  = req.params.id;
    const uid = req.uid;
    try { 
        const medico = await Medico.findById( id );
        if ( !medico ) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id',
            });
        }
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }
        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true } );
        res.json({
            ok: true,
            medico: medicoActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}
const borrarMedico = async(req, res = response) => {
    const id  = req.params.id;
    try {  
        const medico = await Medico.findById( id );
        if ( !medico ) {
            return res.status(404).json({
                ok: true,
                msg: 'Medico no encontrado por id',
            });
        }

        await Medico.findByIdAndDelete( id );
        res.json({
            ok: true,
            msg: 'Médico borrado'
        }); 

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}