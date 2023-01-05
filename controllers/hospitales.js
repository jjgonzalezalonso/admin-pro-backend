const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {
    const hospitales = await Hospital.find()
                                    .populate('usuario','nombre email');
    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async(req, res = response) => {
    const uid = req.uid;  // se obtiene al pasar la validación del token

    const hospital = new Hospital({ 
        usuario: uid,
        ...req.body  // por ahora solo recibo el nombre
    });

    try {
        const hospitalDB = await hospital.save();
        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error crearHospital'
        });
    }
}

const actualizarHospital = async(req, res = response) => {
    const id  = req.params.id; //63b05920accda435c81f7bed
    const uid = req.uid;  //uid del usuario, 
    // lo tenemos pq pasamos por la identificacion del JWT

    try {   
        const hospital = await Hospital.findById( id );
        if ( !hospital ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado por id',
            });
        }

        //hospital.nombre=req.body.nombre; // de otra forma

        const cambiosHospital = {
            ...req.body, // todo lo que viene en el body
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );
        // new: true para que regrese el último documento actualizado
        res.json({
            ok: true,
            hospital: hospitalActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarHospital = async(req, res = response) => {
    const id  = req.params.id;

    try {  
        const hospital = await Hospital.findById( id );
        if ( !hospital ) {
            return res.status(404).json({
                ok: true,
                msg: 'Hospital no encontrado por id',
            });
        }
        await Hospital.findByIdAndDelete( id );
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
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
    getHospitales,crearHospital,actualizarHospital,borrarHospital
}