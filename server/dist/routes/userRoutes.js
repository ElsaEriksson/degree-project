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
// router.get("/", authMiddleware, async (req: Request, res: Response) => {
//   try {
//     if (req.userId) {
//       // Registered user
//       const [results] = await pool.query<RowDataPacket[]>(
//         "SELECT * FROM Users WHERE user_id = ?",
//         [req.userId]
//       );
//       const user = results[0] as User;
//       res.json(user);
//     } else if (req.guestId) {
//       // Guest user
//       res.json({ id: req.guestId, type: "guest" });
//     } else {
//       res.status(401).json({ error: "Unauthorized" });
//     }
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// });
router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required" });
            return;
        }
        const [rows] = yield db_1.default.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const user = rows[0];
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        res.json(user);
        return;
    }
    catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}));
// Add a new user
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, role } = req.body;
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
