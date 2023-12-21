import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

//Crear la app
const app = express();

//conexion a la base de datos

try {
    await db.authenticate();
    console.log('conexion correcta');
} catch (error) {
    console.log(error);
    console.log('error base de datos');
}


//Habilitar Pug
app.set('view engine', 'pug') //se define que se utlizara pug para mostrar las vistas
app.set('views', './views') //definimos e que carpeta se almacenan las vistas

//carpeta publica
app.use(express.static('public'))

//routing
app.use('/auth', usuarioRoutes);


//Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () => {
    console.log(`el servidor esta en el puerto ${port}`);
})