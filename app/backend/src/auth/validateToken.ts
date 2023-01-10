import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import getUserByEmail from './getUserByEmail';

const secret = String(process.env.JWT_SECRET);

type Decode = {
  email: string;
  role: string;
};

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  try {
    const decoded = jwt.verify(token, secret) as Decode;

    const user = await getUserByEmail(decoded.email);

    req.body.role = decoded.role;

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next();
};

export default validateToken;
