import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt';
import Usuario from '../models/Usuario.js';
import { generarId, generarJWT } from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    //es la ruta de la vista que queremos mostrar
    res.render('auth/login', {
        pagina: 'Iniciar sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    //VALIDACION
    await check('email').isEmail().withMessage('El email no es valido!').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    let resultado = validationResult(req)

    //verficar que el resultado este vacio
    if (!resultado.isEmpty()) {

        //redireccionar
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            usuario: {
                email: req.body.email
            }
        })
    }

    const { email, password } = req.body

    //comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario no existe!' }]
        })
    }

    //Comprobar si el usuario esta confirmado
    if (!usuario.confirmado) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'Tu cuenta no ha sido confimada!' }]
        })
    }

    //revisar el password
    if (!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar sesion',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El password es incorrecto!' }],
            usuario: {
                email: req.body.email
            }
        })
    }

    //autenticar al usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre });

    //almacenar en cookies
    return res.cookie('_token', token, {
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')

}

const cerrarSesion = (req, res) =>{
    return res.clearCookie('_token').status(200).redirect('/auth/login')
}


const formularioRegistro = (req, res) => {

    //es la ruta de la vista que queremos mostrar
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()
    })
}

//*registrar usuarios nuevos
const registrar = async (req, res) => {

    //validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('El email no es valido!').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El password debe contener minimo 6 caracteres').run(req)
    await check('repetir_password').equals('password').withMessage('Los password no coinciden').run(req)


    let resultado = validationResult(req)

    //verficar que el resultado este vacio
    if (!resultado.isEmpty()) {

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
    const { nombre, email, password } = req.body

    //verificar que el usuario (email) no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })

    if (existeUsuario) {

        //redireccionar
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya se encuentra regsitrado!' }],
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
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmacion, presiona en el siguiente enlace para confirmar!'
    })


}

//funcion que comprueba una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params;

    //verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta intenta nuevamente',
            error: true
        })
    }

    //confirmar la cuenta
    usuario.token = null
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente'
    })

}

const formularioOlvidePassword = (req, res) => {
    //es la ruta de la vista que queremos mostrar
    res.render('auth/olvide-Password', {
        pagina: 'Recupera tu acceso',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {
    //validacion
    await check('email').isEmail().withMessage('El email no es valido!').run(req)

    let resultado = validationResult(req)

    //verficar que el resultado este vacio
    if (!resultado.isEmpty()) {

        //redireccionar
        return res.render('auth/olvide-Password', {
            pagina: 'Recupera tu acceso',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    //buscar el usuario
    const { email } = req.body
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/olvide-Password', {
            pagina: 'Recupera tu acceso',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El email no pertenece a ningun usuario' }]
        })
    }

    //generar nuevo token
    usuario.token = generarId()
    await usuario.save();

    //envia email de 
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //renderizar un mensaje de revisar correo
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones!'
    })
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    //verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al recuperar tu acceso',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        })
    }

    res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        mensaje: 'Define tu nueva contraseña',
        csrfToken: req.csrfToken(),
    })

}

const nuevopassword = async (req, res) => {
    //validar password
    await check('password').isLength({ min: 6 }).withMessage('El password debe contener minimo 6 caracteres').run(req)

    let resultado = validationResult(req)

    //verficar que el resultado este vacio
    if (!resultado.isEmpty()) {

        //redireccionar
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El password debe contener minimo 6 caracteres' }],
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    //identificar quien hace el password
    const usuario = await Usuario.findOne({ where: { token } })

    //hashear el password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);

    //borrar token
    usuario.token = null
    await usuario.save();

    //renderizar vista
    res.render('auth/confirmar-cuenta', {
        pagina: 'Password reestablecido',
        mensaje: 'el password se actualizo correctamente'
    })
}


//exportamos funciones
export {
    formularioLogin,
    autenticar,
    cerrarSesion,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevopassword,

}