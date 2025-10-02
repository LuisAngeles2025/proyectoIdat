import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Stock = sequelize.define('Stock', {
    stock_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'productos',
            key: 'producto_id'
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
    almacen_secundario_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'almacenes_secundario',
            key: 'almacen_secundario_id'
        }
    },
    cantidad_disponible: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    cantidad_reservada: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    ubicacion: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    fecha_vencimiento: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    lote: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('disponible', 'reservado', 'agotado', 'vencido'),
        allowNull: false,
        defaultValue: 'disponible',
        validate: {
            isIn: [['disponible', 'reservado', 'agotado', 'vencido']]
        }
    }
}, {
    tableName: 'stock',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    validate: {
        almacenValidation() {
            if ((this.almacen_principal_id === null && this.almacen_secundario_id === null) ||
                (this.almacen_principal_id !== null && this.almacen_secundario_id !== null)) {
                throw new Error('El stock debe estar en un almacén principal O secundario, no en ambos');
            }
        }
    }
});

export default Stock;
