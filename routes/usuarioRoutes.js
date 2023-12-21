import express from 'express';
import { formularioLogin, formularioRegistro, formularioOlvidePassword } from '../controllers/usuarioController.js'

//Crear la app
const router = express.Router();

//Routing
router.get('/login', formularioLogin) //esta funcion viene definida en el controlador que es donde se esta retornando la vista
router.get('/registro', formularioRegistro)
router.get('/olvide-Password', formularioOlvidePassword)


export default router