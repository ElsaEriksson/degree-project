import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      guestId?: string;
      userRole?: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const guestId = req.headers["guest-id"] as string;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          role: string;
        };
        req.userId = decoded.id;
        req.userRole = decoded.role;
      } catch (error) {
        console.error("Invalid token:", error);
        return res.status(401).json({ error: "Invalid token" });
      }
    } else if (guestId) {
      // Validera gästID-format
      if (guestId.startsWith("guest_")) {
        req.guestId = guestId;
      } else {
        return res.status(400).json({ error: "Invalid guest ID format" });
      }
    } else {
      return res.status(401).json({ error: "Authentication required" });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware för att kräva inloggad användare
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.userId) {
    return res.status(401).json({ error: "Login required" });
  }
  next();
};

// Middleware för att kräva admin-behörighet
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
