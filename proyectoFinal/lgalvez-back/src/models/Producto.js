import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Producto = sequelize.define('Producto', {
    producto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 50]
        }
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 150]
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    categoria: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    marca: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0
        }
    },
    medida_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'medidas',
            key: 'medida_id'
        }
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    stock_maximo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000,
        validate: {
            min: 0
        }
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo', 'descontinuado'),
        allowNull: false,
        defaultValue: 'activo',
        validate: {
            isIn: [['activo', 'inactivo', 'descontinuado']]
        }
    }
}, {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});

export default Producto;
