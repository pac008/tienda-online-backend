const { response } = require("express");
const bcryptjs = require('bcryptjs')

const { Usuario } = require('../models');

const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google.verify");



const login = async ( req, res = response ) => {

    const { correo, password } = req.body;
    try {
        //Comprobrar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if( !usuario ) {
            return res.status(400).json({
                msg: 'Correo / Password No son válidos - correo'
            })
        }
        //Si el usuario está activo
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Correo / Password no son válidos - estado false'
            })
        }
        //Verificar contraseña
        const passwordValida = bcryptjs.compareSync( password, usuario.password );
        
        if( !passwordValida ) {
            return res.status(400).json({
                msg: 'Correo / Password no son Válidos - password'
            });
        }

        //Generar el JWT

        const token = await generarJWT( usuario.id );

        res.json({
           usuario,
           token
        });
    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSingIn = async ( req, res = response ) => {
    
    const { id_token } = req.body;

    try {

        const { nombre, correo, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            
            const data = {
                nombre,
                correo,
                img,
                password: ':p',
                google: true

            }

            usuario = new Usuario( data );

            await usuario.save();
           
        }

        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Acceso denegado, hable con el administrador'
            })
        }
        
        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        

        
    } catch (error) {
        res.status(400).json({
            msg: 'El Token de Google no es válido'
        })
    }



}


module.exports = {
    login,
    googleSingIn
}