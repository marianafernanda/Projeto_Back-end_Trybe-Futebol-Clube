import { compareSync } from 'bcryptjs';
import getUserByEmail from './getUserByEmail';
import User from '../interfaces/user.interface';

const validatePassword = async (user: User) => {
  const userPassword = await getUserByEmail(user.email);

  if (!userPassword) {
    return 'Incorrect email or password';
  }

  const validePassword = compareSync(user.password, userPassword);

  if (!validePassword) {
    return 'Incorrect email or password';
  }
};

export default validatePassword;
