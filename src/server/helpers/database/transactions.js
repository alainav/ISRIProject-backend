import { consoleError } from "../../utils/logger.js";

export const revertirTransaccion = async (res, error, transaction, message) => {
  await transaction.rollback();
  consoleError(null, error, message, "red");
  res.status(500).json({ message: error.message || message });
};
