import bcryptjs from "bcryptjs";

export const hashearPassword = (password: string) => {
  return bcryptjs.hashSync(password, 10);
};

export const comparePassword = (
  newCodeAccess: number,
  DBCodeAccess: number
) => {
  return newCodeAccess == DBCodeAccess;
};
