
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { Usuario } = require('../models');


const usuariosGet = async (req = request, res = response) => {
    
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };
    
    // const usuarios = await Usuario.find( query )
    //     .skip( Number( desde ) )
    //     .limit( Number( limit ) );

    // const total = await usuario.countDocuments( query );

    const [ total, usuarios ]  = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip( Number( desde ) )
            .limit( Number( limit ) )

    ]);


    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol }); 

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en DB
    await usuario.save();

    res.json({
        msg:'Registrado correctamente ',  
        usuario
    });
}
const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, correo, google, ...resto } = req.body;

    //TODO validar contra base de datos
    if( password ) {
          //Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );

    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );


    res.json( usuario );
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json( usuario )
}

const usuariosPatch = (req, res = response) => {
    res.json({msg:'patch api - controllers'})
}


module.exports= {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch
}