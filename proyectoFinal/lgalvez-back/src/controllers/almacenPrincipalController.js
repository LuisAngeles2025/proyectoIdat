import { AlmacenPrincipal } from '../models/index.js';
import { Op } from 'sequelize';

export const almacenPrincipalController = {
    // CREATE - Crear nuevo almacén principal
    async crearAlmacenPrincipal(req, res) {
        try {
            const { nombre, direccion, telefono, email, responsable, capacidad_total, capacidad_disponible } = req.body;
            
            const nuevoAlmacen = await AlmacenPrincipal.create({
                nombre,
                direccion,
                telefono,
                email,
                responsable,
                capacidad_total,
                capacidad_disponible: capacidad_disponible || capacidad_total
            });

            res.status(201).json({
                success: true,
                message: 'Almacén principal creado exitosamente',
                data: nuevoAlmacen
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear almacén principal',
                error: error.message
            });
        }
    },

    // READ - Obtener todos los almacenes principales
    async obtenerAlmacenesPrincipal(req, res) {
        try {
            const { page = 1, limit = 10, search, estado } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { nombre: { [Op.like]: `%${search}%` } },
                        { direccion: { [Op.like]: `%${search}%` } },
                        { responsable: { [Op.like]: `%${search}%` } }
                    ]
                };
            }
            if (estado) {
                whereClause.estado = estado;
            }

            const { count, rows: almacenes } = await AlmacenPrincipal.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: almacenes,
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
                message: 'Error al obtener almacenes principales',
                error: error.message
            });
        }
    },

    // READ - Obtener almacén principal por ID
    async obtenerAlmacenPrincipalPorId(req, res) {
        try {
            const { id } = req.params;
            const almacen = await AlmacenPrincipal.findByPk(id);

            if (!almacen) {
                return res.status(404).json({
                    success: false,
                    message: 'Almacén principal no encontrado'
                });
            }

            res.json({
                success: true,
                data: almacen
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener almacén principal',
                error: error.message
            });
        }
    },

    // READ - Obtener almacenes principales activos
    async obtenerAlmacenesPrincipalActivos(req, res) {
        try {
            const almacenes = await AlmacenPrincipal.findAll({
                where: { estado: 'activo' },
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: almacenes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener almacenes principales activos',
                error: error.message
            });
        }
    },

    // UPDATE - Actualizar almacén principal
    async actualizarAlmacenPrincipal(req, res) {
        try {
            const { id } = req.params;
            const { nombre, direccion, telefono, email, responsable, capacidad_total, capacidad_disponible, estado } = req.body;

            const almacen = await AlmacenPrincipal.findByPk(id);
            if (!almacen) {
                return res.status(404).json({
                    success: false,
                    message: 'Almacén principal no encontrado'
                });
            }

            await almacen.update({
                nombre,
                direccion,
                telefono,
                email,
                responsable,
                capacidad_total,
                capacidad_disponible,
                estado
            });

            res.json({
                success: true,
                message: 'Almacén principal actualizado exitosamente',
                data: almacen
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al actualizar almacén principal',
                error: error.message
            });
        }
    },

    // DELETE - Eliminar almacén principal
    async eliminarAlmacenPrincipal(req, res) {
        try {
            const { id } = req.params;
            const almacen = await AlmacenPrincipal.findByPk(id);

            if (!almacen) {
                return res.status(404).json({
                    success: false,
                    message: 'Almacén principal no encontrado'
                });
            }

            await almacen.destroy();

            res.json({
                success: true,
                message: 'Almacén principal eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar almacén principal',
                error: error.message
            });
        }
    }
};
