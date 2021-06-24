const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');

const { existeCategoria, existeNombreCategoria } = require('../helpers/db-validators');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria} = require('../controllers/categorias');



const router = Router();

//obtener Categorias
router.get('/', obtenerCategorias);

//Obtener categoría por id
router.get('/:id',[
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom( existeCategoria  ),
    validarCampos
], obtenerCategoria );

//Crear categoría
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    esAdminRol,
    validarCampos
], crearCategoria );

// Actualizar categoría
router.put('/:id',[
    validarJWT,
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom( existeCategoria  ),
    check('nombre').custom( existeNombreCategoria ),
    esAdminRol,
    validarCampos
], actualizarCategoria );

//Borrar categoría
router.delete('/:id',[
    validarJWT,
    check('id', 'No es un id Válido').isMongoId(),
    check('id').custom( existeCategoria ),
    esAdminRol,
    validarCampos
], borrarCategoria );





module.exports = router;