import { logger } from './logger.js';

export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function handleError(error, context = '') {
  const contextMsg = context ? ` in ${context}` : '';
  
  if (error instanceof AppError) {
    logger.error(`Application error${contextMsg}:`, {
      message: error.message,
      code: error.code,
    });
    return error;
  }

  logger.error(`Unexpected error${contextMsg}:`, {
    message: error.message,
    stack: error.stack,
  });

  return new AppError(
    error.message || 'An unknown error occurred',
    'UNKNOWN_ERROR'
  );
}
