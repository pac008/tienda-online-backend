const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, actualizarImagen, obtenerImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarCampos, validarArchivo } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();


router.post('/',[ validarArchivo ], cargarArchivo );

router.put('/:coleccion/:id',[
    validarArchivo,
    check('id','El id debe que ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, colecciones = ['usuarios','productos']) ),
    validarCampos
], actualizarImagenCloudinary ) 

router.get('/:coleccion/:id', [
    check('id','El id debe que ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas ( c, colecciones = ['usuarios','productos']) ),
    validarCampos
], obtenerImagen )

module.exports = router;
