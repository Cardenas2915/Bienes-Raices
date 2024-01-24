import jwt from "jsonwebtoken";
import { Usuario } from '../models/index.js'

const protegerRuta = async (req, res, next) => {

    //*verificar si hay un token
    //extraer el token de las cookies
    const { _token } = req.cookies

    if(!_token) {
        return res.redirect('/auth/login')
    }

    //*comprobar el token
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
        return res.clearCookie('_token').redirect('/auth/login')
    }

    
}

export default protegerRuta;