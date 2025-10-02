import { Router } from 'express';
import { stockController } from '../controllers/stockController.js';

const router = Router();

// Rutas CRUD para Stock
router.post('/', stockController.crearStock);
router.get('/', stockController.obtenerStock);
router.get('/producto/:producto_id', stockController.obtenerStockPorProducto);
router.get('/almacen-principal/:almacen_principal_id', stockController.obtenerStockPorAlmacenPrincipal);
router.get('/almacen-secundario/:almacen_secundario_id', stockController.obtenerStockPorAlmacenSecundario);
router.get('/stock-bajo', stockController.obtenerProductosStockBajo);
router.get('/:id', stockController.obtenerStockPorId);
router.put('/:id', stockController.actualizarStock);
router.delete('/:id', stockController.eliminarStock);

export default router;
