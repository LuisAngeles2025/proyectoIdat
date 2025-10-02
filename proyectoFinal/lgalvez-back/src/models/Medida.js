import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Medida = sequelize.define('Medida', {
    medida_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 50]
        }
    },
    simbolo: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [1, 10]
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    tipo: {
        type: DataTypes.ENUM('peso', 'volumen', 'longitud', 'unidad'),
        allowNull: false,
        validate: {
            isIn: [['peso', 'volumen', 'longitud', 'unidad']]
        }
    },
    factor_conversion: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false,
        defaultValue: 1.0000,
        validate: {
            min: 0.0001
        }
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
            isIn: [['activo', 'inactivo']]
        }
    }
}, {
    tableName: 'medidas',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default Medida;
