"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const guestId = req.headers["guest-id"];
        if (token) {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                req.userId = decoded.id;
                req.userRole = decoded.role;
            }
            catch (error) {
                console.error("Invalid token:", error);
                return res.status(401).json({ error: "Invalid token" });
            }
        }
        else if (guestId) {
            // Validera gästID-format
            if (guestId.startsWith("guest_")) {
                req.guestId = guestId;
            }
            else {
                return res.status(400).json({ error: "Invalid guest ID format" });
            }
        }
        else {
            return res.status(401).json({ error: "Authentication required" });
        }
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware för att kräva inloggad användare
const requireAuth = (req, res, next) => {
    if (!req.userId) {
        return res.status(401).json({ error: "Login required" });
    }
    next();
};
exports.requireAuth = requireAuth;
// Middleware för att kräva admin-behörighet
const requireAdmin = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
