
const { Role, Categoria, Usuario, Producto } = require('../models');


const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe`);
    }
}

const existeCorreo = async ( correo ) => {

    const correoExiste = await Usuario.findOne({ correo });
    if ( correoExiste ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async ( id ) => {

    const existeUsuario = await Usuario.findById( id );
    if ( !existeUsuario ) {
        throw new Error(`El Usuario con el id: ${ id }, no está registrado`);
    }
}


// validaciones de categoría
const existeCategoria = async ( id ) => {

    const existeCategoria = await Categoria.findById( id );
    if ( !existeCategoria ) {
        throw new Error(`La Categoria con el id: ${ id }, no está registrada`);
    }

}

const existeNombreCategoria = async ( nombre ) => {
    let  name  = nombre.toUpperCase();

    if ( name.length === 0 ) {
            throw new Error(`El nombre debe tener algún valor`);
    }

    const existeNombre = await Categoria.findOne({ nombre: name });

    if ( existeNombre ) {
        throw new Error(`La Categoria con el nombre: ${ nombre }, ya está registrada`);
    }

}


// Validaciones de productos

const existeNombreProducto = async ( nombre ) => {

    if( nombre === "") {
        throw new Error(`EL producto debe tener algún nombre válido`);
    }

    // Si el nombre no se envía entonces retornar un true
    if ( !nombre ) {
        return true;
    }

    // Si se envía se valida.
  
    let  name  = nombre.toUpperCase();

    const existeNombre = await Producto.findOne({ nombre: name });

    if ( existeNombre ) {
        throw new Error(`EL producto con el nombre: ${ nombre }, ya está registrada`);
    }
}


const existeProductoPorId = async ( id ) => {

    const existeProducto = await Producto.findById( id )

    if( !existeProducto ) {
        throw new Error(`No existe producto con ese ID ${ id }`);
    }
}


// Validar colecciones en uploads

const coleccionesPermitidas = ( coleccion, colecciones = [] ) => {
    
    const incluida = colecciones.includes( coleccion );

    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida. - ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRolValido,
    existeCorreo,
    existeUsuarioPorId,
    existeCategoria,
    existeNombreCategoria,
    existeNombreProducto,
    existeProductoPorId,
    coleccionesPermitidas
}