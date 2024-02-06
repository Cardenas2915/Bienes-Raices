import express from "express";
import { inicio, categoria, noEncontrado, buscador } from '../controllers/appController.js'

const router = express.Router();

//pagina de inicio
router.get('/', inicio)


//categorias 
router.get('/categorias/:id', categoria)


//pagina 404
router.get('/404', noEncontrado)

//buscador
router.post('/buscador', buscador)


export default router;



