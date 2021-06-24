const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos,
        validarJWT,
        tieneRol  } = require('../middlewares');


const { esRolValido, existeCorreo, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPost,
        usuariosDelete,
        usuariosPut,
        usuariosPatch } = require('../controllers/usuarios');


const router = Router();


router.get('/', usuariosGet )

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La password debe tener más de 6 letras').isLength({ min: 6 }),
        check('password', 'La password debe tener más de 6 letras').isLength({ min: 6 }),
        check('correo', 'Esto no es un correo válido').isEmail(),
        //Verificar correo
        check('correo').custom( existeCorreo ),
        // check('rol', 'El rol no es válido').isIn(['ADMIN_ROL', 'USER_ROL']),
        check('rol').custom( esRolValido ),
        validarCampos,
] ,usuariosPost );

router.put('/:id',[
        check('id', 'No es un id Válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        check('rol').custom( esRolValido ),
        validarCampos
], usuariosPut )

router.delete('/:id',[
        validarJWT,
        // esAdminRol,
        tieneRol('ADMIN_ROL','VENTAS_ROL'),
        check('id', 'No es un id Válido').isMongoId(),
        check('id').custom( existeUsuarioPorId ),
        validarCampos
], usuariosDelete )

router.patch('/', usuariosPatch )



module.exports = router;