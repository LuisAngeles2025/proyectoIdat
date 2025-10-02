import Medida from './Medida.js';
import AlmacenPrincipal from './AlmacenPrincipal.js';
import AlmacenSecundario from './AlmacenSecundario.js';
import Producto from './Producto.js';
import Stock from './Stock.js';

// Definir relaciones

// Almacén Principal -> Almacenes Secundarios (1:N)
AlmacenPrincipal.hasMany(AlmacenSecundario, { 
    foreignKey: 'almacen_principal_id',
    as: 'almacenesSecundarios'
});
AlmacenSecundario.belongsTo(AlmacenPrincipal, { 
    foreignKey: 'almacen_principal_id',
    as: 'almacenPrincipal'
});

// Medida -> Productos (1:N)
Medida.hasMany(Producto, { 
    foreignKey: 'medida_id',
    as: 'productos'
});
Producto.belongsTo(Medida, { 
    foreignKey: 'medida_id',
    as: 'medida'
});

// Producto -> Stock (1:N)
Producto.hasMany(Stock, { 
    foreignKey: 'producto_id',
    as: 'stock'
});
Stock.belongsTo(Producto, { 
    foreignKey: 'producto_id',
    as: 'producto'
});

// Almacén Principal -> Stock (1:N)
AlmacenPrincipal.hasMany(Stock, { 
    foreignKey: 'almacen_principal_id',
    as: 'stock'
});
Stock.belongsTo(AlmacenPrincipal, { 
    foreignKey: 'almacen_principal_id',
    as: 'almacenPrincipal'
});

// Almacén Secundario -> Stock (1:N)
AlmacenSecundario.hasMany(Stock, { 
    foreignKey: 'almacen_secundario_id',
    as: 'stock'
});
Stock.belongsTo(AlmacenSecundario, { 
    foreignKey: 'almacen_secundario_id',
    as: 'almacenSecundario'
});

// Exportar modelos
export {
    Medida,
    AlmacenPrincipal,
    AlmacenSecundario,
    Producto,
    Stock
};
