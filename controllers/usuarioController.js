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

const formularioOlvidePassword = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/olvide-Password', {
        pagina: 'Recupera tu acceso'
    }) 
}

export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}