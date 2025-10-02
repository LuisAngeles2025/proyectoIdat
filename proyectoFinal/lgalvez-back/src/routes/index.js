import { Router } from 'express';
import medidaRoutes from './medidaRoutes.js';
import almacenPrincipalRoutes from './almacenPrincipalRoutes.js';
import almacenSecundarioRoutes from './almacenSecundarioRoutes.js';
import productoRoutes from './productoRoutes.js';
import stockRoutes from './stockRoutes.js';

const router = Router();

// Rutas de la API
router.use('/api/medidas', medidaRoutes);
router.use('/api/almacenes-principal', almacenPrincipalRoutes);
router.use('/api/almacenes-secundario', almacenSecundarioRoutes);
router.use('/api/productos', productoRoutes);
router.use('/api/stock', stockRoutes);

// Ruta de prueba
router.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'API de Almacén funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

export default router;
