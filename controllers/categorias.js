const { response } = require("express");

const { Categoria, Usuario } = require("../models");


//obtenerCategorias - paginado - total - populate 

const obtenerCategorias = async ( req, res = response ) => {

   
    const { limit = 255, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, categorias ]  = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
        .skip( desde )
        .limit( limit )
        .populate('usuario','nombre')
    
    ]);

    res.json({
        total,
        categorias
    })
   

 
}

// obtener categoria - populate  {}

const obtenerCategoria = async ( req, res = response ) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id )
                                                .populate('usuario','nombre');

    res.json(
        categoria
    )
}

const crearCategoria = async ( req, res = response ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAutenticado._id
    }

    const categoria = new Categoria( data );

    //Guardar en DB
    await categoria.save();

    res.status(201).json( categoria );
}

// actualizar categoría 

const actualizarCategoria = async ( req, res = response ) => {

    const { id } = req.params;
    const { usuario, estado, ...data  } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuarioAutenticado._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new: true }  );

    try {
        
        res.json({
            categoria
        })
        
    } catch (error) {
        
        console.log( error );   
        
        res.status(400).json({ 
            meg: error
        })
    }
}

//borrar caregoría - estado false 
const borrarCategoria = async ( req, res ) => {
    const { id } = req.params;
    const estado = { estado: false };
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, estado, { new: true } );
    
    res.json({
        categoriaBorrada
    })
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}