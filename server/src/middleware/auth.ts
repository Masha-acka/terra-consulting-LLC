import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};

export const requireRole = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }

        next();
    };
};
