import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import app from './app';

const PORT = 8000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
  })
  .catch((err) => {
    console.error('DB Connection Failed', err);
  });
