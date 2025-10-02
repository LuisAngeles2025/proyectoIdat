import { Producto, Medida } from '../models/index.js';
import { Op } from 'sequelize';

export const productoController = {
    // CREATE - Crear nuevo producto
    async crearProducto(req, res) {
        try {
            const { codigo, nombre, descripcion, categoria, marca, precio_unitario, medida_id, stock_minimo, stock_maximo } = req.body;
            
            const nuevoProducto = await Producto.create({
                codigo,
                nombre,
                descripcion,
                categoria,
                marca,
                precio_unitario,
                medida_id,
                stock_minimo: stock_minimo || 0,
                stock_maximo: stock_maximo || 1000
            });

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                data: nuevoProducto
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear producto',
                error: error.message
            });
        }
    },

    // READ - Obtener todos los productos
    async obtenerProductos(req, res) {
        try {
            const { page = 1, limit = 10, search, categoria, estado } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { codigo: { [Op.like]: `%${search}%` } },
                        { nombre: { [Op.like]: `%${search}%` } },
                        { descripcion: { [Op.like]: `%${search}%` } },
                        { marca: { [Op.like]: `%${search}%` } }
                    ]
                };
            }
            if (categoria) {
                whereClause.categoria = categoria;
            }
            if (estado) {
                whereClause.estado = estado;
            }

            const { count, rows: productos } = await Producto.findAndCountAll({
                where: whereClause,
                include: [{
                    model: Medida,
                    as: 'medida',
                    attributes: ['nombre', 'simbolo', 'tipo']
                }],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: productos,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(count / limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos',
                error: error.message
            });
        }
    },

    // READ - Obtener producto por ID
    async obtenerProductoPorId(req, res) {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id, {
                include: [{
                    model: Medida,
                    as: 'medida'
                }]
            });

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: producto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener producto',
                error: error.message
            });
        }
    },

    // READ - Obtener producto por código
    async obtenerProductoPorCodigo(req, res) {
        try {
            const { codigo } = req.params;
            const producto = await Producto.findOne({
                where: { codigo },
                include: [{
                    model: Medida,
                    as: 'medida'
                }]
            });

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                data: producto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener producto por código',
                error: error.message
            });
        }
    },

    // READ - Obtener productos por categoría
    async obtenerProductosPorCategoria(req, res) {
        try {
            const { categoria } = req.params;
            const productos = await Producto.findAll({
                where: { categoria },
                include: [{
                    model: Medida,
                    as: 'medida',
                    attributes: ['nombre', 'simbolo']
                }],
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos por categoría',
                error: error.message
            });
        }
    },

    // READ - Obtener productos activos
    async obtenerProductosActivos(req, res) {
        try {
            const productos = await Producto.findAll({
                where: { estado: 'activo' },
                include: [{
                    model: Medida,
                    as: 'medida',
                    attributes: ['nombre', 'simbolo']
                }],
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: productos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos activos',
                error: error.message
            });
        }
    },

    // UPDATE - Actualizar producto
    async actualizarProducto(req, res) {
        try {
            const { id } = req.params;
            const { codigo, nombre, descripcion, categoria, marca, precio_unitario, medida_id, stock_minimo, stock_maximo, estado } = req.body;

            const producto = await Producto.findByPk(id);
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            await producto.update({
                codigo,
                nombre,
                descripcion,
                categoria,
                marca,
                precio_unitario,
                medida_id,
                stock_minimo,
                stock_maximo,
                estado
            });

            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                data: producto
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al actualizar producto',
                error: error.message
            });
        }
    },

    // DELETE - Eliminar producto
    async eliminarProducto(req, res) {
        try {
            const { id } = req.params;
            const producto = await Producto.findByPk(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            await producto.destroy();

            res.json({
                success: true,
                message: 'Producto eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar producto',
                error: error.message
            });
        }
    }
};
