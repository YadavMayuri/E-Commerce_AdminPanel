import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET not defined in .env");

export const generateToken = (id: number) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: '7d',
  });
};
