import { Router } from 'express';
import { getProducts, createProduct, deleteAllProducts } from '../controllers/productController.js';

const router = Router();

router.get('/produtos', getProducts);
router.post('/produtos', createProduct);
router.delete('/produtos', deleteAllProducts);

export default router;