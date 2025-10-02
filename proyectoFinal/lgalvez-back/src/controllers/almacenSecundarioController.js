import { AlmacenSecundario, AlmacenPrincipal } from '../models/index.js';
import { Op } from 'sequelize';

export const almacenSecundarioController = {
    // CREATE - Crear nuevo almacén secundario
    async crearAlmacenSecundario(req, res) {
        try {
            const { nombre, direccion, telefono, email, responsable, capacidad_total, capacidad_disponible, almacen_principal_id } = req.body;
            
            const nuevoAlmacen = await AlmacenSecundario.create({
                nombre,
                direccion,
                telefono,
                email,
                responsable,
                capacidad_total,
                capacidad_disponible: capacidad_disponible || capacidad_total,
                almacen_principal_id
            });

            res.status(201).json({
                success: true,
                message: 'Almacén secundario creado exitosamente',
                data: nuevoAlmacen
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear almacén secundario',
                error: error.message
            });
        }
    },

    // READ - Obtener todos los almacenes secundarios
    async obtenerAlmacenesSecundario(req, res) {
        try {
            const { page = 1, limit = 10, search, estado, almacen_principal_id } = req.query;
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
            if (almacen_principal_id) {
                whereClause.almacen_principal_id = almacen_principal_id;
            }

            const { count, rows: almacenes } = await AlmacenSecundario.findAndCountAll({
                where: whereClause,
                include: [{
                    model: AlmacenPrincipal,
                    as: 'almacenPrincipal',
                    attributes: ['nombre']
                }],
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
                message: 'Error al obtener almacenes secundarios',
                error: error.message
            });
        }
    },

    // READ - Obtener almacén secundario por ID
    async obtenerAlmacenSecundarioPorId(req, res) {
        try {
            const { id } = req.params;
            const almacen = await AlmacenSecundario.findByPk(id, {
                include: [{
                    model: AlmacenPrincipal,
                    as: 'almacenPrincipal'
                }]
            });

            if (!almacen) {
                return res.status(404).json({
                    success: false,
                    message: 'Almacén secundario no encontrado'
                });
            }

            res.json({
                success: true,
                data: almacen
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener almacén secundario',
                error: error.message
            });
        }
    },

    // READ - Obtener almacenes secundarios por almacén principal
    async obtenerAlmacenesSecundarioPorPrincipal(req, res) {
        try {
            const { almacen_principal_id } = req.params;
            const almacenes = await AlmacenSecundario.findAll({
                where: { almacen_principal_id },
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: almacenes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener almacenes secundarios por almacén principal',
                error: error.message
            });
        }
    },

    // READ - Obtener almacenes secundarios activos
    async obtenerAlmacenesSecundarioActivos(req, res) {
        try {
            const almacenes = await AlmacenSecundario.findAll({
                where: { estado: 'activo' },
                include: [{
                    model: AlmacenPrincipal,
                    as: 'almacenPrincipal',
                    attributes: ['nombre']
                }],
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: almacenes
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener almacenes secundarios activos',
                error: error.message
            });
        }
    },

    // UPDATE - Actualizar almacén secundario
    async actualizarAlmacenSecundario(req, res) {
        try {
            const { id } = req.params;
            const { nombre, direccion, telefono, email, responsable, capacidad_total, capacidad_disponible, almacen_principal_id, estado } = req.body;

            const almacen = await AlmacenSecundario.findByPk(id);
            if (!almacen) {
                return res.status(404).json({
                    success: false,
                    message: 'Almacén secundario no encontrado'
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
                almacen_principal_id,
                estado
            });

            res.json({
                success: true,
                message: 'Almacén secundario actualizado exitosamente',
                data: almacen
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al actualizar almacén secundario',
                error: error.message
            });
        }
    },

    // DELETE - Eliminar almacén secundario
    async eliminarAlmacenSecundario(req, res) {
        try {
            const { id } = req.params;
            const almacen = await AlmacenSecundario.findByPk(id);

            if (!almacen) {
                return res.status(404).json({
                    success: false,
                    message: 'Almacén secundario no encontrado'
                });
            }

            await almacen.destroy();

            res.json({
                success: true,
                message: 'Almacén secundario eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar almacén secundario',
                error: error.message
            });
        }
    }
};
