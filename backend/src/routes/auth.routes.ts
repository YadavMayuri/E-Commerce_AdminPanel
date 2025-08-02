import { Router } from 'express';
import { registerAdmin, loginAdmin, getCurrentAdmin } from '../controllers/auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/getCurrentAdmin', protect, getCurrentAdmin);

export default router;
