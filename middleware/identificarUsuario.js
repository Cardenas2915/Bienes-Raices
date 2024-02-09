import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

const identificarUsuario = async (req,res, next) => {

    //identificar si hay token en las cookies
    const { _token } = req.cookies
    if(!_token){
        req.usuario = null
        return next()
    }
    //comprobar el token

    try {

        //verificamos si el token es valido
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)

        //buscar el usuario en la BD que corresponda y extraemos la informacion 
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)
        
        //almacenar el usuario al request
        if(usuario){
            req.usuario = usuario
        }else {
            return res.redirect('/auth/login')
        }

        return next();
    } catch (error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
} 

export default identificarUsuario