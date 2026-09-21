/**
 * Recursively sanitizes request inputs by deleting keys starting with '$' or containing '.'
 * to prevent NoSQL query injection attacks.
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    obj.forEach(sanitizeObject);
    return obj;
  }
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
};

export const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};
