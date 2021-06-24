const { Router, response } = require('express');
const { check } = require('express-validator');
const { crearProducto, 
        obtenerProductos, 
        obtenerProductoPorId, 
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const { existeNombreProducto, existeCategoria, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();


//{{url}}/api/productos


// get productos
router.get('/', obtenerProductos );


// get producto

router.get('/:id',[
    check('id','No es un id válido').isMongoId(),
    check('id','Debe mandar un id').not().isEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProductoPorId );

// Crear producto

router.post('/',[
    validarJWT,
    check('categoria','No es un id Válido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    check('nombre','EL nombre debe tener algún valor').not().isEmpty(),
    validarCampos,
], crearProducto );

// Actualizar producto

router.put('/:id',[
    validarJWT,
    check('id','No es un id válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('categoria','No es un ID Válido').isMongoId(),
    validarCampos,
], actualizarProducto )

// Borrar producto

router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id','Tiene que venir un valor').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto )


module.exports = router;