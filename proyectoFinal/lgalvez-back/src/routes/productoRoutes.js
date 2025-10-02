import { Router } from 'express';
import { productoController } from '../controllers/productoController.js';

const router = Router();

// Rutas CRUD para Productos
router.post('/', productoController.crearProducto);
router.get('/', productoController.obtenerProductos);
router.get('/activos', productoController.obtenerProductosActivos);
router.get('/categoria/:categoria', productoController.obtenerProductosPorCategoria);
router.get('/codigo/:codigo', productoController.obtenerProductoPorCodigo);
router.get('/:id', productoController.obtenerProductoPorId);
router.put('/:id', productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

export default router;
