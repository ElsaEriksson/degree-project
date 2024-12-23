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
const router = express_1.default.Router();
router.get("/user/:sessionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            res.status(400).json({ error: "Email is required" });
            return;
        }
        const [rows] = yield db_1.default.query("SELECT id, name, email FROM users WHERE user_id = ?", [sessionId]);
        if (rows.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const user = rows[0];
        res.json(user);
        return;
    }
    catch (error) {
        console.error("Failed to fetch user:", error);
        throw new Error("Failed to fetch user.");
    }
}));
// router.post("/", async (req: Request, res: Response) => {
//   const { first_name, last_name, email, password, role } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const [result] = await pool.query<ResultSetHeader>(
//       `INSERT INTO Users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
//       [first_name, last_name, email, hashedPassword, role || "user"]
//     );
//     res.status(201).json({
//       id: (result as any).insertId,
//       first_name,
//       last_name,
//       email,
//       role: role || "user",
//     });
//   } catch (error: any) {
//     if (error.code === "ER_DUP_ENTRY") {
//       res.status(400).json({ error: "Email already exists." });
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });
exports.default = router;
