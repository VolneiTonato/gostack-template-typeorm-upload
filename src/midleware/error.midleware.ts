import { Response, Request, NextFunction } from 'express';
import AppError from '../errors/AppError';

export default function ErrorMidleware(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction,
): Response<JSON> {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}
