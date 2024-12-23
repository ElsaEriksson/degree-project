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
const createCartsTable = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.query(`
      CREATE TABLE IF NOT EXISTS Carts (
        cart_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
        INDEX idx_guest_id (guest_id)
      );
    `);
    console.log("Carts table created successfully!");
});
const createCartItemsTable = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.query(`
      CREATE TABLE IF NOT EXISTS CartItems (
        cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        variant_id INT NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES Carts(cart_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
        FOREIGN KEY (variant_id) REFERENCES Variants(variant_id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_variant (cart_id, variant_id)
      );
    `);
    console.log("CartItems table created successfully!");
});
const createTablesForCart = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield db_1.default.getConnection();
        yield createCartsTable(connection);
        yield createCartItemsTable(connection);
    }
    catch (error) {
        console.error("Error creating cart tables:", error);
    }
    finally {
        if (connection)
            connection.release();
    }
});
exports.default = createTablesForCart;
