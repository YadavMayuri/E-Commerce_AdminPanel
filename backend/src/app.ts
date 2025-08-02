import express from 'express';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;
