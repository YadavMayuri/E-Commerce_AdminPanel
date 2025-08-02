import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/ormconfig';
import { Admin } from '../entities/Admin';
import { generateToken } from '../utils/generateToken';

const adminRepo = AppDataSource.getRepository(Admin);

export const registerAdmin = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 5) {
        return res.status(400).json({ message: 'Password must be at least 5 characters long' });
    }

    try {
        const existingUser = await adminRepo.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: 'Admin already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = adminRepo.create({ name, email, password: hashedPassword });

        await adminRepo.save(newAdmin);

        res.status(201).json({
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
};

export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const admin = await adminRepo.findOne({ where: { email } });
        if (!admin) return res.status(400).json({ message: 'Email not found!' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({ message: 'Login successful', token: generateToken(admin.id), });

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
};


export const getCurrentAdmin = async (req: Request, res: Response) => {
    try {
        const userId = (req as Request & { userId?: number }).userId;

        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const admin = await adminRepo.findOneBy({ id: Number(userId) });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        res.json({ id: admin.id, name: admin.name, email: admin.email });

    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err });
    }
};


