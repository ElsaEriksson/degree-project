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
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [results] = yield db_1.default.query("SELECT * FROM Users");
        const users = results;
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Add a new user
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, role } = req.body;
    // Kontrollera att alla nödvändiga fält finns
    // if (!first_name || !last_name || !email || !password) {
    //   return res.status(400).json({ error: "All fields are required." });
    // }
    // Validera förnamn och efternamn
    // if (first_name.length < 2 || last_name.length < 2) {
    //   return res.status(400).json({ error: "First name and last name must be at least 2 characters long." });
    // }
    // const nameRegex = /^[A-Za-z\s]+$/;
    // if (!nameRegex.test(first_name) || !nameRegex.test(last_name)) {
    //   return res.status(400).json({ error: "First name and last name can only contain letters and spaces." });
    // }
    // // Validera e-postadress
    // const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // if (!emailRegex.test(email)) {
    //   return res.status(400).json({ error: "Invalid email format." });
    // }
    // // Kontrollera om e-postadressen redan finns
    // const [existingUser] = await pool.query<RowDataPacket[]>("SELECT * FROM Users WHERE email = ?", [email]);
    // if (existingUser.length > 0) {
    //   return res.status(400).json({ error: "Email already exists." });
    // }
    // // Validera lösenord
    // if (password.length < 8) {
    //   return res.status(400).json({ error: "Password must be at least 8 characters long." });
    // }
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({ error: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character." });
    // }
    try {
        // Hasha lösenordet innan det lagras i databasen
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Kör frågan
        const [result] = yield db_1.default.query(`INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`, [first_name, last_name, email, hashedPassword, role || "user"]);
        // Returnera det skapade objektet
        res.status(201).json({
            id: result.insertId,
            first_name,
            last_name,
            email,
            role: role || "user",
        });
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(400).json({ error: "Email already exists." });
        }
        else {
            res.status(500).json({ error: error.message });
        }
    }
}));
exports.default = router;
