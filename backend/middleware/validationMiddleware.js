import { logger } from "../config/logger.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err.errors) {
      const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
      logger.warn(`[Validation Failed] ${req.method} ${req.originalUrl} - ${messages}`);
      return res.status(400).json({ error: `Validation error: ${messages}` });
    }
    logger.warn(`[Validation Failed] ${req.method} ${req.originalUrl} - Invalid request payload`);
    return res.status(400).json({ error: "Invalid request payload" });
  }
};
