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
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUsersTable = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.query(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
    console.log("Users table created successfully!");
});
const insertInitialUser = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash("secure_password", 10);
    yield connection.query(`INSERT INTO Users (first_name, last_name, email, password, role)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE user_id=user_id;`, ["John", "Doe", "john.doe@example.com", hashedPassword, "user"]);
    console.log("Initial user added successfully!");
});
const createTablesForUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield db_1.default.getConnection();
        yield createUsersTable(connection);
        yield insertInitialUser(connection);
    }
    catch (error) {
        console.error("Error creating tables or inserting user:", error);
    }
    finally {
        if (connection)
            connection.release();
    }
});
exports.default = createTablesForUsers;
