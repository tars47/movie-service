const { AxiosError } = require("axios");

/**
 * @description ->  This utility class is used to define a http error
 */
class HttpError {
  /**
   *  @description ->  This constructor is used to define a http error
   */
  constructor(error, code) {
    this.statusCode = 500;

    if (error instanceof AxiosError) {
      this.error = error.response?.data || error.response;
      this.statusCode = error.response?.status || 500;
    } else if (error instanceof Error) {
      if (error.code) {
        switch (error.code) {
          case "23505":
            {
              this.error = { message: "RESOURCE_ALREADY_EXISTS" };
              this.statusCode = 403;
            }
            break;
          case "23503":
            {
              this.error = { message: "USER_NOT_FOUND" };
              this.statusCode = 404;
            }
            break;
        }
      } else {
        this.error = { message: "UNKNOWN_ERR", errors: error.message };
      }
    } else {
      this.error = error;
    }
    if (code) this.statusCode = code;
  }
}

module.exports = HttpError;
