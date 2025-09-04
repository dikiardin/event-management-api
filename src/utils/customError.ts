export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    // fix for instanceof checks
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}