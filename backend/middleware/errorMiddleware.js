import { logger } from "../config/logger.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  logger.error(`[Error ${statusCode}] ${req.method} ${req.originalUrl}: ${err.message}`);

  const isProduction = process.env.NODE_ENV === "production";
  const errorMessage =
    statusCode === 500 && isProduction
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: errorMessage,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};
