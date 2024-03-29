import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt' //dependencia para hashear el password
import db from '../config/db.js';

const usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull:false
    },
    email: {
        type: DataTypes.STRING,
        allowNull:false
    },
    password: {
        type: DataTypes.STRING,
        allowNull:false
    },
    token: {
        type:DataTypes.STRING
    },
    confirmado: DataTypes.BOOLEAN
},{
    hooks: {
        beforeCreate: async function(usuario){
            //hashear el password antes del registro
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    },
    scopes: {
        //al momento de realizar una consulta al usuario va eliminar estos campos de la consulta
        eliminarPassword : {
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
})

//metodo personalizados

usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


export default usuario ;