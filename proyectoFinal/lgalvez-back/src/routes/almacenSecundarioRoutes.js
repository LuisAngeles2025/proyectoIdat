import { Router } from 'express';
import { almacenSecundarioController } from '../controllers/almacenSecundarioController.js';

const router = Router();

// Rutas CRUD para Almacenes Secundarios
router.post('/', almacenSecundarioController.crearAlmacenSecundario);
router.get('/', almacenSecundarioController.obtenerAlmacenesSecundario);
router.get('/activos', almacenSecundarioController.obtenerAlmacenesSecundarioActivos);
router.get('/principal/:almacen_principal_id', almacenSecundarioController.obtenerAlmacenesSecundarioPorPrincipal);
router.get('/:id', almacenSecundarioController.obtenerAlmacenSecundarioPorId);
router.put('/:id', almacenSecundarioController.actualizarAlmacenSecundario);
router.delete('/:id', almacenSecundarioController.eliminarAlmacenSecundario);

export default router;
