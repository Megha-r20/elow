import { logger } from "../config/logger.js";

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;
    next();
  } catch (err) {
    if (err.issues && Array.isArray(err.issues) && err.issues.length > 0) {
      const messages = err.issues.map((e) => `${e.path ? e.path.join(".") : "field"}: ${e.message}`).join(", ");
      logger.warn(`[Validation Failed] ${req.method} ${req.originalUrl} - ${messages}`);
      return res.status(400).json({ error: `Validation error: ${messages}` });
    }
    logger.warn(`[Validation Failed] ${req.method} ${req.originalUrl} - Invalid request payload`);
    return res.status(400).json({ error: "Invalid request payload" });
  }
};
