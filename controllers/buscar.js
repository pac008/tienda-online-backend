const { response } = require("express");
const { ObjectId } = require("mongoose").Types;


const { Categoria, Producto, Usuario  } = require('../models');


const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
];

const buscarCategorias = async ( termino = '', res = response ) => {

    const isMongoId =  ObjectId.isValid( termino ); // true

    if ( isMongoId ) {
        const categorias = await Categoria.findById( termino );
        return res.json({
            results: ( categorias ) ? [ categorias ] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments({ nombre: regexp, estado: true}),
        Categoria.find({ nombre: regexp, estado: true })
    ] )

    res.json({
        total,
        results: categorias
    });

}

const buscarProductos = async ( termino = '', res = response ) => {
    
    const isMongoId =  ObjectId.isValid( termino ); // true

    if ( isMongoId ) {
        const productos = await Producto.findById( termino )
                                        .populate('categoria','nombre');
        return res.json({
            results: ( productos ) ? [ productos ] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({ nombre: regexp, estado: true }),
        Producto.find({ nombre: regexp, estado: true })
                                        .populate('categoria','nombre')
    ] )

    res.json({
        total,
        results: productos
    });

}

const buscarUsuarios = async ( termino = '', res = response ) => {

    const isMongoId =  ObjectId.isValid( termino ); // true

    if ( isMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regexp = new RegExp(termino, 'i');

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({
            $or: [{ nombre: regexp }, { correo: regexp }],
            $and: [{ estado: true }]
        }),
        Usuario.find({
            $or: [{ nombre: regexp }, { correo: regexp }],
            $and: [{ estado: true }]
        })
    ] )

    res.json({
        total,
        results: usuarios
    });
}



const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${ coleccionesPermitidas }`
        });
    }

    switch ( coleccion ) {
        case 'categorias':
            buscarCategorias( termino, res );
        break;
        case 'productos':
            buscarProductos( termino, res );
        break;
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;
    
        default:
            return res.status(500).json({
                msg: 'se me olvidó hacer esta busqueda'
            })
        break;
    }
}



module.exports = {
    buscar
}