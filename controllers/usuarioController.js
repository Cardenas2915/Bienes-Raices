const formularioLogin = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/login', {
        
    }) 
}

const formularioRegistro = (req, res) =>{
    //es la ruta de la vista que queremos mostrar
    res.render('auth/registro', {
        
    }) 
}

export {
    formularioLogin,
    formularioRegistro
}