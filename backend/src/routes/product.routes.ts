import { Router } from 'express';
import upload from '../middlewares/multer';
import { addProduct, deleteProduct, getAllProductsByAdmin, updateProduct } from '../controllers/product.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Upload multiple images with field name 'images'
router.post('/addProduct', protect, upload.array('images', 5), addProduct);
router.get('/allProducts', protect, getAllProductsByAdmin);
router.put('/product/:id', protect, upload.array('images'), updateProduct);
router.delete('/deleteProduct/:id', protect, deleteProduct);

export default router;
