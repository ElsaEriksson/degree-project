"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const [results] = yield db_1.default.query("SELECT * FROM Users WHERE email = ?", [email]);
        if (results.length === 0) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const user = results[0];
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        res.json({ user });
    }
    catch (error) {
        console.error("Failed to fetch user:", error);
        res.status(500).json({ error: error.message });
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, email, password, role } = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(400).json({ error: "All fields are required." });
            return;
        }
        if (first_name.length < 2 || last_name.length < 2) {
            res.status(400).json({
                error: "First name and last name must be at least 2 characters long.",
            });
            return;
        }
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
            res.status(400).json({
                error: "First name and last name can only contain letters and spaces.",
            });
            return;
        }
        // Validera e-postadress
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid email format." });
            return;
        }
        // Kontrollera om e-postadressen redan finns
        const [existingUser] = yield db_1.default.query("SELECT * FROM Users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            res.status(400).json({ error: "Email already exists." });
            return;
        }
        // Validera lösenord
        if (password.length < 8) {
            res
                .status(400)
                .json({ error: "Password must be at least 8 characters long." });
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
                error: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
            });
            return;
        }
        const allowedRoles = ["user", "admin"];
        if (role && !allowedRoles.includes(role)) {
            res.status(400).json({ error: "Invalid role." });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Insert new user
        const [result] = yield db_1.default.query(`INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`, [first_name, last_name, email, hashedPassword, role || "user"]);
        const newUserId = result.insertId;
        res.status(201).json({
            user: {
                user_id: newUserId,
                first_name,
                email,
                role: role || "user",
            },
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "An error occurred during registration" });
    }
}));
exports.default = router;
