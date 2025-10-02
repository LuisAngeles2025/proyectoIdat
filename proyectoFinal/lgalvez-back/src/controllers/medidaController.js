import { Medida } from '../models/index.js';
import { Op } from 'sequelize';

export const medidaController = {
    // CREATE - Crear nueva medida
    async crearMedida(req, res) {
        try {
            const { nombre, simbolo, descripcion, tipo, factor_conversion } = req.body;
            
            const nuevaMedida = await Medida.create({
                nombre,
                simbolo,
                descripcion,
                tipo,
                factor_conversion: factor_conversion || 1.0000
            });

            res.status(201).json({
                success: true,
                message: 'Medida creada exitosamente',
                data: nuevaMedida
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al crear medida',
                error: error.message
            });
        }
    },

    // READ - Obtener todas las medidas
    async obtenerMedidas(req, res) {
        try {
            const { page = 1, limit = 10, search, tipo } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { nombre: { [Op.like]: `%${search}%` } },
                        { simbolo: { [Op.like]: `%${search}%` } },
                        { descripcion: { [Op.like]: `%${search}%` } }
                    ]
                };
            }
            if (tipo) {
                whereClause.tipo = tipo;
            }

            const { count, rows: medidas } = await Medida.findAndCountAll({
                where: whereClause,
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: medidas,
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
                message: 'Error al obtener medidas',
                error: error.message
            });
        }
    },

    // READ - Obtener medida por ID
    async obtenerMedidaPorId(req, res) {
        try {
            const { id } = req.params;
            const medida = await Medida.findByPk(id);

            if (!medida) {
                return res.status(404).json({
                    success: false,
                    message: 'Medida no encontrada'
                });
            }

            res.json({
                success: true,
                data: medida
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener medida',
                error: error.message
            });
        }
    },

    // READ - Obtener medidas por tipo
    async obtenerMedidasPorTipo(req, res) {
        try {
            const { tipo } = req.params;
            const medidas = await Medida.findAll({
                where: { tipo },
                order: [['nombre', 'ASC']]
            });

            res.json({
                success: true,
                data: medidas
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener medidas por tipo',
                error: error.message
            });
        }
    },

    // UPDATE - Actualizar medida
    async actualizarMedida(req, res) {
        try {
            const { id } = req.params;
            const { nombre, simbolo, descripcion, tipo, factor_conversion, estado } = req.body;

            const medida = await Medida.findByPk(id);
            if (!medida) {
                return res.status(404).json({
                    success: false,
                    message: 'Medida no encontrada'
                });
            }

            await medida.update({
                nombre,
                simbolo,
                descripcion,
                tipo,
                factor_conversion,
                estado
            });

            res.json({
                success: true,
                message: 'Medida actualizada exitosamente',
                data: medida
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Error al actualizar medida',
                error: error.message
            });
        }
    },

    // DELETE - Eliminar medida
    async eliminarMedida(req, res) {
        try {
            const { id } = req.params;
            const medida = await Medida.findByPk(id);

            if (!medida) {
                return res.status(404).json({
                    success: false,
                    message: 'Medida no encontrada'
                });
            }

            await medida.destroy();

            res.json({
                success: true,
                message: 'Medida eliminada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar medida',
                error: error.message
            });
        }
    }
};
