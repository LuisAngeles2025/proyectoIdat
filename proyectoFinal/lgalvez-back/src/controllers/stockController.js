import { Stock, Producto, AlmacenPrincipal, AlmacenSecundario } from '../models/index.js';
import { Op } from 'sequelize';

export const stockController = {
    // CREATE - Crear nuevo registro de stock
    async crearStock(req, res) {
        try {
            const { producto_id, almacen_principal_id, almacen_secundario_id, cantidad_disponible, cantidad_reservada, ubicacion, fecha_vencimiento, lote } = req.body;
            
            // Validar que solo se especifique un tipo de almacén
            if ((almacen_principal_id && almacen_secundario_id) || (!almacen_principal_id && !almacen_secundario_id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe especificar solo un almacén (principal o secundario)'
                });
            }

            const nuevoStock = await Stock.create({
                producto_id,
                almacen_principal_id,
                almacen_secundario_id,
                cantidad_disponible: cantidad_disponible || 0,
                cantidad_reservada: cantidad_reservada || 0,
                ubicacion,
                fecha_vencimiento,
                lote
            });

            res.status(201).json({
                success: true,
                message: 'Stock creado exitosamente',
                data: nuevoStock
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear stock',
                error: error.message
            });
        }
    },

    // READ - Obtener todo el stock
    async obtenerStock(req, res) {
        try {
            const { page = 1, limit = 10, search, estado, almacen_principal_id, almacen_secundario_id } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { ubicacion: { [Op.like]: `%${search}%` } },
                        { lote: { [Op.like]: `%${search}%` } }
                    ]
                };
            }
            if (estado) {
                whereClause.estado = estado;
            }
            if (almacen_principal_id) {
                whereClause.almacen_principal_id = almacen_principal_id;
            }
            if (almacen_secundario_id) {
                whereClause.almacen_secundario_id = almacen_secundario_id;
            }

            const { count, rows: stock } = await Stock.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Producto,
                        as: 'producto',
                        attributes: ['codigo', 'nombre', 'categoria', 'marca']
                    },
                    {
                        model: AlmacenPrincipal,
                        as: 'almacenPrincipal',
                        attributes: ['nombre']
                    },
                    {
                        model: AlmacenSecundario,
                        as: 'almacenSecundario',
                        attributes: ['nombre']
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: stock,
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
                message: 'Error al obtener stock',
                error: error.message
            });
        }
    },

    // READ - Obtener stock por ID
    async obtenerStockPorId(req, res) {
        try {
            const { id } = req.params;
            const stock = await Stock.findByPk(id, {
                include: [
                    {
                        model: Producto,
                        as: 'producto'
                    },
                    {
                        model: AlmacenPrincipal,
                        as: 'almacenPrincipal'
                    },
                    {
                        model: AlmacenSecundario,
                        as: 'almacenSecundario'
                    }
                ]
            });

            if (!stock) {
                return res.status(404).json({
                    success: false,
                    message: 'Stock no encontrado'
                });
            }

            res.json({
                success: true,
                data: stock
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener stock',
                error: error.message
            });
        }
    },

    // READ - Obtener stock por producto
    async obtenerStockPorProducto(req, res) {
        try {
            const { producto_id } = req.params;
            const stock = await Stock.findAll({
                where: { producto_id },
                include: [
                    {
                        model: AlmacenPrincipal,
                        as: 'almacenPrincipal',
                        attributes: ['nombre']
                    },
                    {
                        model: AlmacenSecundario,
                        as: 'almacenSecundario',
                        attributes: ['nombre']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: stock
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener stock por producto',
                error: error.message
            });
        }
    },

    // READ - Obtener stock por almacén principal
    async obtenerStockPorAlmacenPrincipal(req, res) {
        try {
            const { almacen_principal_id } = req.params;
            const stock = await Stock.findAll({
                where: { almacen_principal_id },
                include: [
                    {
                        model: Producto,
                        as: 'producto',
                        attributes: ['codigo', 'nombre', 'categoria']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: stock
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener stock por almacén principal',
                error: error.message
            });
        }
    },

    // READ - Obtener stock por almacén secundario
    async obtenerStockPorAlmacenSecundario(req, res) {
        try {
            const { almacen_secundario_id } = req.params;
            const stock = await Stock.findAll({
                where: { almacen_secundario_id },
                include: [
                    {
                        model: Producto,
                        as: 'producto',
                        attributes: ['codigo', 'nombre', 'categoria']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json({
                success: true,
                data: stock
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener stock por almacén secundario',
                error: error.message
            });
        }
    },

    // READ - Obtener productos con stock bajo
    async obtenerProductosStockBajo(req, res) {
        try {
            const stock = await Stock.findAll({
                include: [
                    {
                        model: Producto,
                        as: 'producto',
                        where: {
                            [Op.and]: [
                                { estado: 'activo' },
                                {
                                    [Op.or]: [
                                        { stock_minimo: { [Op.gt]: 0 } }
                                    ]
                                }
                            ]
                        }
                    }
                ],
                order: [['cantidad_disponible', 'ASC']]
            });

            // Filtrar productos donde el stock disponible es menor al mínimo
            const productosStockBajo = stock.filter(item => 
                item.cantidad_disponible <= item.producto.stock_minimo
            );

            res.json({
                success: true,
                data: productosStockBajo
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos con stock bajo',
                error: error.message
            });
        }
    },

    // UPDATE - Actualizar stock
    async actualizarStock(req, res) {
        try {
            const { id } = req.params;
            const { cantidad_disponible, cantidad_reservada, ubicacion, fecha_vencimiento, lote, estado } = req.body;

            const stock = await Stock.findByPk(id);
            if (!stock) {
                return res.status(404).json({
                    success: false,
                    message: 'Stock no encontrado'
                });
            }

            await stock.update({
                cantidad_disponible,
                cantidad_reservada,
                ubicacion,
                fecha_vencimiento,
                lote,
                estado
            });

            res.json({
                success: true,
                message: 'Stock actualizado exitosamente',
                data: stock
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al actualizar stock',
                error: error.message
            });
        }
    },

    // DELETE - Eliminar stock
    async eliminarStock(req, res) {
        try {
            const { id } = req.params;
            const stock = await Stock.findByPk(id);

            if (!stock) {
                return res.status(404).json({
                    success: false,
                    message: 'Stock no encontrado'
                });
            }

            await stock.destroy();

            res.json({
                success: true,
                message: 'Stock eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar stock',
                error: error.message
            });
        }
    }
};
