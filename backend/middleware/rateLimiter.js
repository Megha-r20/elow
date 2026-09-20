import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many authentication requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
