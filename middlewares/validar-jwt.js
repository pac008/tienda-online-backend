
const { request, response } = require('express');
const jwt = require('jsonwebtoken');    
const { Usuario } = require('../models');



const validarJWT = async ( req = request, res = response, next ) => {

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );

        //leer el usuario que corresponda al uid
        const usuarioAutenticado = await Usuario.findById( uid );

        if( !usuarioAutenticado ) {
            return res.status(401).json({
                msg: 'token no válido -- Usuario no existe'
            });
        }

        //verificar si el usuario tiene estado true
        if( !usuarioAutenticado.estado ) {
            return res.status(401).json({
                msg: 'token no válido -- estado false'
            });
        }

        req.usuarioAutenticado = usuarioAutenticado;

        next();
    } catch ( err ) {
        console.log( err );
        res.status(401).json({
            msg: 'Token no válido'
        })
    }


}





module.exports = {
    validarJWT
}