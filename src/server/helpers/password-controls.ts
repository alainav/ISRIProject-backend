import bcryptjs from "bcryptjs";

export const EncriptarPassword = (password: string): string => {
  const salt = bcryptjs.genSaltSync();
  return bcryptjs.hashSync(password, salt);
};

export const ComprobarPassword = (
  testPassword: string,
  realPassword: string
): boolean => {
  return bcryptjs.compareSync(testPassword, realPassword);
};

export default { EncriptarPassword, ComprobarPassword };
