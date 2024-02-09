import  express  from "express";
import { body } from 'express-validator'
import { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios, eliminarPropiedad, cambiarEstado, mostrarPropiedad, enviarMensaje, verMensajes } from "../controllers/propiedadesController.js"
import protegerRuta from "../middleware/protegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";


const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin)
router.get('/propiedades/Crear', protegerRuta, crear)
router.post('/propiedades/Crear', protegerRuta,

    //validaciones
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),

    body('descripcion')
    .notEmpty().withMessage('la decripcion no puede ir vacia')
    .isLength({max: 200}).withMessage('La descripcion es muy larga'),

    body('categoria').isNumeric().withMessage('Seleccione una categoria'),
    body('precio').isNumeric().withMessage('Seleccione una rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

    //funcion a ejecutar en el controlador
    guardar 
)

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)

router.post('/propiedades/agregar-imagen/:id',protegerRuta, upload.single('imagen'), almacenarImagen)

router.get('/propiedades/editar/:id', 
    protegerRuta,
    editar
)

router.post('/propiedades/editar/:id', protegerRuta,

    //validaciones
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),

    body('descripcion')
    .notEmpty().withMessage('la decripcion no puede ir vacia')
    .isLength({max: 200}).withMessage('La descripcion es muy larga'),

    body('categoria').isNumeric().withMessage('Seleccione una categoria'),
    body('precio').isNumeric().withMessage('Seleccione una rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

    //funcion a ejecutar en el controlador
    guardarCambios
)

router.post('/propiedades/eliminar/:id',
    protegerRuta,
    eliminarPropiedad
)

router.put('/propiedades/:id',
    protegerRuta,
    cambiarEstado
)


//Area publica o sin login
router.get('/propiedad/:id', 
    identificarUsuario,
    mostrarPropiedad
)

//almacenar los mensajes
router.post('/propiedad/:id', 
    identificarUsuario,
    body('mensaje').isLength({min:10}).withMessage('El mensaje no puede ir vacio o es muy corto'),
    enviarMensaje
)

router.get('/mensajes/:id',
    protegerRuta,
    verMensajes
)

export default router