import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
  };
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function authenticate(
  req: AuthRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

export async function optionalAuth(
  req: AuthRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token;

    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.userId);
        if (user) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
          };
        }
      }
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
}

