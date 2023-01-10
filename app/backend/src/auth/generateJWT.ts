import { sign } from 'jsonwebtoken';
import User from '../interfaces/user.interface';

export default class GenerateJWT {
  secret: string;

  constructor() {
    this.secret = String(process.env.JWT_SECRET);
  }

  public token(user: User, role: string): string {
    const payload = { email: user.email, role };
    const token = sign(payload, this.secret);
    return token;
  }
}
