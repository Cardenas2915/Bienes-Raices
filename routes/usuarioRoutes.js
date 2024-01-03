import express from 'express';
import { formularioLogin, autenticar, formularioRegistro, formularioOlvidePassword, registrar, confirmar, resetPassword, comprobarToken, nuevopassword } from '../controllers/usuarioController.js'

//Crear la app
const router = express.Router();

//Routing
router.get('/login', formularioLogin) //esta funcion viene definida en el controlador que es donde se esta retornando la vista
router.post('/login', autenticar) 

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar)
router.get('/olvide-Password', formularioOlvidePassword)
router.post('/olvide-Password', resetPassword)

//almacenar nuevo password
router.get('/olvide-Password/:token', comprobarToken);
router.post('/olvide-Password/:token', nuevopassword);




export default router