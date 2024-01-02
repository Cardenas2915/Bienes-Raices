import { DataTypes } from 'sequelize';
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
})

export default usuario ;