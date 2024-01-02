import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js' ;
import { generarId } from '../helpers/tokens.js';
import { emailRegistro } from '../helpers/emails.js';

const formularioLogin = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/login', {
        pagina: 'Iniciar sesion'
    }) 
}

const formularioRegistro = (req, res) =>{

    //es la ruta de la vista que queremos mostrar
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
            errores: [{msg:'El usuario ya se encuentra regsitrado!'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        }) 
    }
    
    //crear el usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //envia email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //Mostrar mensaje de confirmacion
    res.render('templates/mensaje',{
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el siguiente enlace para confirmar!'
    })
    

}

//funcion que comprueba una cuenta
const confirmar = async  (req, res) => {
    const { token } = req.params;

    //verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}});

    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta intenta nuevamente',
            error: true
        })
    }

    //confirmar la cuenta
    usuario.token = null
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente'
    })
    
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
    registrar,
    confirmar
}