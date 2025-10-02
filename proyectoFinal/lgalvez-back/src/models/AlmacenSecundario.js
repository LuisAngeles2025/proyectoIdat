import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AlmacenSecundario = sequelize.define('AlmacenSecundario', {
    almacen_secundario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            len: [7, 20]
        }
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    responsable: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    capacidad_total: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    capacidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0
        }
    },
    almacen_principal_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'almacenes_principal',
            key: 'almacen_principal_id'
        }
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo', 'mantenimiento'),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
            isIn: [['activo', 'inactivo', 'mantenimiento']]
        }
    }
}, {
    tableName: 'almacenes_secundario',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default AlmacenSecundario;
