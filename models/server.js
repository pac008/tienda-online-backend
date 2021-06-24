
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const fileUpload = require('express-fileupload');
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Rutas
        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:    '/api/uploads',
            usuarios:   '/api/usuarios'
        }
        //Conectar a la base de datos
        this.conectarDB();
        //middlerwares
        this.middlewares();

        //rutas de la app
        this.router();
    }

    async conectarDB() {
        await dbConection();
    }

    middlewares() {
        //cors
        this.app.use( cors() )

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio público
        this.app.use( express.static('public') );

        // Uploads - subidas de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    router() {
        this.app.use( this.paths.auth, require('../routes/auth') );
        this.app.use( this.paths.buscar, require('../routes/buscar') );
        this.app.use( this.paths.categorias, require('../routes/categorias') );
       this.app.use( this.paths.productos, require('../routes/productos') );
       this.app.use( this.paths.uploads, require('../routes/uploads') );
       this.app.use( this.paths.usuarios, require('../routes/usuarios') );
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en: ', this.port );
        });
    }
}


module.exports = Server;