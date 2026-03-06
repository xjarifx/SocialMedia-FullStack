import rateLimit from "express-rate-limit";

// General API endpoints
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Content creation limiter
export const createPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many posts created, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req as any).userId || req.ip || "unknown",
});
