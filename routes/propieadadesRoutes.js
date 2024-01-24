import  express  from "express";
import { body } from 'express-validator'
import { admin, crear, guardar } from "../controllers/propiedadesController.js"
import protegerRuta from "../middleware/protegerRuta.js";


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

export default router