import UserModel from '../database/models/UserModel';

const getRoleByEmail = async (email: string) => {
  const user = await UserModel.findOne({ where: { email } });
  return user?.role;
};

export default getRoleByEmail;
