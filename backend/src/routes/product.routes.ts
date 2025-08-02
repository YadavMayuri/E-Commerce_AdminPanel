import { Router } from 'express';
const router = Router();

// You’ll add controller functions here later
router.get('/', (req, res) => res.send("Get all products"));
router.post('/', (req, res) => res.send("Add product"));
router.put('/:id', (req, res) => res.send("Update product"));
router.delete('/:id', (req, res) => res.send("Delete product"));

export default router;
