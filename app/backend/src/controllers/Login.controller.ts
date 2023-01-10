import { Request, Response } from 'express';
import GenerateJWT from '../auth/generateJWT';
import validatePassword from '../auth/validatePassword';

export default class LoginController {
  static async login(req: Request, res: Response) {
    const user = req.body;
    console.log(user.password);

    try {
      const validation = await validatePassword(user);

      if (typeof validation === 'string') {
        return res.status(401).json({ message: validation });
      }

      const generateJWT = new GenerateJWT();

      const token = generateJWT.token(user);

      res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
}
