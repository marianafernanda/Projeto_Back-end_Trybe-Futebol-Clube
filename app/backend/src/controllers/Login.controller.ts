import { Request, Response } from 'express';
import GenerateJWT from '../auth/generateJWT';
import validatePassword from '../auth/validatePassword';
import getRoleByEmail from '../auth/getRoleFromEmail';

export default class LoginController {
  static async login(req: Request, res: Response) {
    const user = req.body;

    const validation = await validatePassword(user);

    if (typeof validation === 'string') {
      return res.status(401).json({ message: validation });
    }

    const role = await getRoleByEmail(user.email);

    const generateJWT = new GenerateJWT();

    const token = generateJWT.token(user, role as string);

    res.status(200).json({ token });
  }

  static async loginValidate(req: Request, res: Response) {
    const { role } = req.body;

    return res.status(200).json({ role });
  }
}
