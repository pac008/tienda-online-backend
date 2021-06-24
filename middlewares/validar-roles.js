const { response } = require("express");




const esAdminRol = ( req, res = response , next ) => {

    if ( !req.usuarioAutenticado ) {
        return res.status(500).json({
            msg: 'Se debe validar el token antes de validar el rol'
        });
    }

    const { nombre, rol } = req.usuarioAutenticado;

    if ( rol !== 'ADMIN_ROL') {
        return res.status(401).json({
            msg: `${ nombre } no es administrador - no puede hacer esto`
        })
    }

    next();

}


const tieneRol = ( ...roles ) => {
    return ( req, res = response , next ) => {
        if ( !req.usuarioAutenticado ) {
            return res.status(500).json({
                msg: 'Se debe validar el token antes de validar el rol'
            });
        }

        if ( !roles.includes( req.usuarioAutenticado.rol ) ) {
            return res.status(401).json({
                msg: `EL servicio requiere uno de estos roles ${ roles }`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRol,
    tieneRol
}