"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.id;
        }
        catch (error) {
            console.error("Invalid token");
        }
    }
    if (!req.userId) {
        // Om ingen giltig användartoken, generera ett gäst-ID
        req.guestId = `guest_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;
    }
    next();
};
exports.authMiddleware = authMiddleware;
