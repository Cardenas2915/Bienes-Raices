import { exit } from 'node:process'
import categorias from "./categorias.js";
import precios from './precios.js';
import usuarios from './usuarios.js';

import { Categoria, Precio, Usuario } from '../models/index.js'
import db from "../config/db.js";

const importarDatos = async () => {
    try {

        //autenticar
        await db.authenticate();

        //generar las columnas
        await db.sync();

        //insertamos los datos

        //*con este codigo indicamos que ambos se pueden ejecutar al mismo tiempo ya que ninguno depende del otro
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('datos importados');

        exit();
        
    } catch (error) {
        console.log(error);
        exit(1) //si hay algun error termina la ejecucion
    }
}

const eliminarDatos = async () => {
    try {

        await Promise.all([
            Categoria.destroy({where: {}, truncate:true}),
            Precio.destroy({where: {}, truncate:true})
        ])

        //!elimina las tablas pero es un proceso mas fuerte
        //await db.sync({force:true})
        
        console.log('Datos eliminados');
        exit();

    } catch (error) {
        console.log(error);
        exit();
    }
}

//importar
if(process.argv[2] === "-i"){
    importarDatos();
}

//eliminar
if(process.argv[2] === "-e"){
    eliminarDatos();
}