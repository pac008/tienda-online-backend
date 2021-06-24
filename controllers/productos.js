const { response } = require("express");


const { Producto } = require("../models");





// Obtener productos

const obtenerProductos = async ( req, res = response ) => {

    const { limit = 10, desde = 0} = req.body;
    const query = { estado: true }
    const [ total, productos ] = await Promise.all([
                                Producto.countDocuments( query ),
                                Producto.find( query )
                                .populate('usuario','nombre')
                                .populate('categoria','nombre')
                                .limit( limit )
                                .skip( desde )
    ]);

    res.json({
        total,
        productos
    })
}

// obtener producto por id 


const obtenerProductoPorId = async ( req, res = response ) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
                                    .populate('usuario','nombre')
                                    .populate('categoria','nombre') ;

    res.json(
        producto
    )
}


const crearProducto = async ( req, res = response ) => {

    const { usuario, estado, ...body }  = req.body;
    const nombre = body.nombre.toUpperCase();
    const descripcion = body.descripcion.toLowerCase();
    const precio = body.precio.toLowerCase();
    const existeNombreProducto = await Producto.findOne( {nombre} );

    if ( existeNombreProducto ) {
       return res.status(400).json({
            msg: `El producto con el nombre ${ body.nombre } ya existe`
        });
    }

    const data = {
        ...body,
        nombre,
        descripcion,
        precio,
        usuario: req.usuarioAutenticado._id      
    }


    const producto = new Producto( data );

    await producto.save()

    res.status(201).json( producto )



}


// actualizar producto

const actualizarProducto = async ( req, res = response ) => {

    const { id } = req.params;
    const { usuario, estado, ...data } = req.body;

    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
        
    }
    data.usuario = req.usuarioAutenticado._id
   
    
    const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });
        
        res.json( productoActualizado )
}

// borrar producto 

const borrarProducto = async ( req, res ) => {
    const { id } = req.params;
    // const estado = { estado: false }
    const productoBorrado = await Producto.findByIdAndDelete( id );

    res.json({
        productoBorrado
    })
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    borrarProducto
}