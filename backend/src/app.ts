import express from 'express';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';


const app = express();

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;
