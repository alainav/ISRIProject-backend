import { IGeneralResponse } from "../../interfaces/IGeneralResponse.js";

export default class GeneralResponse implements IGeneralResponse {
  success: boolean;
  message?: string | undefined;
  error?: Error | undefined;
  constructor(
    sucess: boolean,
    message?: string | undefined,
    error?: Error | undefined
  ) {
    this.success = sucess;
    this.message = message;
    this.error = error;
  }

  get data() {
    return {
      success: this.success,
      message: this.message,
      error: this.error,
    };
  }
}
