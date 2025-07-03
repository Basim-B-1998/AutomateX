import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_PASSWORD } from "./config";

interface AuthenticatedRequest extends Request {
  id?: string; // attach user ID to the request
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_PASSWORD) as { id: string };
    req.id = payload.id;
    next();
  } catch (e) {
    res.status(403).json({ message: "You are not logged in" });
  }
};

