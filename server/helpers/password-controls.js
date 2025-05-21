import bcryptjs from "bcryptjs";

export const EncriptarPassword = (password) => {
  //Encriptar la contra
  const salt = bcryptjs.genSaltSync();
  return bcryptjs.hashSync(password, salt);
};

export const ComprobarPassword = (testPassword, realPassword) => {
  const validPass = bcryptjs.compareSync(testPassword, realPassword);
  if (!validPass) {
    return false;
  }
  return true;
};

export default { EncriptarPassword, ComprobarPassword };
