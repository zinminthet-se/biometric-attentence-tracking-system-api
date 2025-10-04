class FormError extends Error {
  constructor(message, statusCode, missingFields) {
    super(message);
    this.name = "FormError";
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.missingFields = missingFields;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = FormError;
