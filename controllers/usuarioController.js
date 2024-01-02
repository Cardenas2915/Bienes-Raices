import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js' ;
import e from 'express';

const formularioLogin = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/login', {
        pagina: 'Iniciar sesion'
    }) 
}

const formularioRegistro = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
    }) 
}

//*registrar usuarios nuevos
const registrar = async (req, res) =>{

    //validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El email no es valido!').run(req)
    await check('password').isLength({ min:6 }).withMessage('El password debe contener minimo 6 caracteres').run(req) 
    await check('repetir_password').equals('password').withMessage('Los password no coinciden').run(req) 


    let resultado = validationResult(req)

    //verficar que el resultado este vacio
    if(!resultado.isEmpty()){

        //redireccionar
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        }) 
    }

    //extraemos los datos
     const {nombre, email, password} = req.body

    //verificar que el usuario (email) no este duplicado
    const existeUsuario = await Usuario.findOne({where: { email }})

    if(existeUsuario){

        //redireccionar
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{msg:'El usuario ya se encuentra regsitrado!'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        }) 
    }
    
    //crear el usuario
    const usuario = await Usuario.create(req.body)

    //damos respuesta
    res.json(usuario) ;

}

const formularioOlvidePassword = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/olvide-Password', {
        pagina: 'Recupera tu acceso'
    }) 
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}