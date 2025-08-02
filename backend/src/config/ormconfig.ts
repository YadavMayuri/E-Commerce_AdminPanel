import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Product } from '../entities/Product';
import { Admin } from '../entities/Admin';
import { ProductImage } from '../entities/ProductImage';

config(); // Load env vars from .env

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Admin, Product, ProductImage],
});
