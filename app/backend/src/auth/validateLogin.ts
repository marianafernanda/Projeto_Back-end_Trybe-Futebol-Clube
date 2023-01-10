import { Request, Response, NextFunction } from 'express';
import User from '../interfaces/user.interface';

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = req.body;

  if (!user.email || !user.password) {
    return res.status(400).json({ message: 'All fields must be filled' });
  }

  return next();
};

export default validateLogin;
