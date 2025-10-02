import { Router } from 'express';
import { almacenPrincipalController } from '../controllers/almacenPrincipalController.js';

const router = Router();

// Rutas CRUD para Almacenes Principales
router.post('/', almacenPrincipalController.crearAlmacenPrincipal);
router.get('/', almacenPrincipalController.obtenerAlmacenesPrincipal);
router.get('/activos', almacenPrincipalController.obtenerAlmacenesPrincipalActivos);
router.get('/:id', almacenPrincipalController.obtenerAlmacenPrincipalPorId);
router.put('/:id', almacenPrincipalController.actualizarAlmacenPrincipal);
router.delete('/:id', almacenPrincipalController.eliminarAlmacenPrincipal);

export default router;
