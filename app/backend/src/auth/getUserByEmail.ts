import UserModel from '../database/models/UserModel';

const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ where: { email } });
  return user?.password;
};

export default getUserByEmail;
