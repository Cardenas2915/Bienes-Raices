import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propieadadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

//Crear la app
const app = express();

//habilitar lectura datos de formularios
app.use(express.urlencoded({extended: true}))

//habilitar cookie parser
app.use (cookieParser())

//habilitar el csrf
app.use(csrf({ cookie: true }))

//conexion a la base de datos
try {
    await db.authenticate();
    db.sync() ;
    console.log('conexion correcta');
} catch (error) {
    console.log(error);
}


//Habilitar Pug
app.set('view engine', 'pug') //se define que se utlizara pug para mostrar las vistas
app.set('views', './views') //definimos e que carpeta se almacenan las vistas

//carpeta publica
app.use(express.static('public'))

//routing
app.use('/', appRoutes);
app.use('/auth', usuarioRoutes);
app.use('/', propiedadesRoutes);
app.use('/api', apiRoutes)


//Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`el servidor esta en el puerto ${port}`);
})