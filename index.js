import express from 'express';
import usuarioRoutes from './routes/usuarioRoutes.js'

//Crear la app
const app = express();

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
    console.log(`el servidor esta funcionando en el puerto ${port}`);
})