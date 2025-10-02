import { Router } from 'express';
import { medidaController } from '../controllers/medidaController.js';

const router = Router();

// Rutas CRUD para Medidas
router.post('/', medidaController.crearMedida);
router.get('/', medidaController.obtenerMedidas);
router.get('/tipo/:tipo', medidaController.obtenerMedidasPorTipo);
router.get('/:id', medidaController.obtenerMedidaPorId);
router.put('/:id', medidaController.actualizarMedida);
router.delete('/:id', medidaController.eliminarMedida);

export default router;
