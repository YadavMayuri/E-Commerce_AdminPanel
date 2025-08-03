import express from 'express';
import productRoutes from './routes/product.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';


const app = express();

app.use(
  cors({
    origin: 'https://e-commerce-admin-panel-bice.vercel.app',
    credentials: true,
  })
);

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;
