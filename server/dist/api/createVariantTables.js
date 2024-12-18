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
const variantsPlaceholderData_1 = require("./variantsPlaceholderData");
const db_1 = __importDefault(require("../config/db"));
const createVariantsTable = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.query(`
          CREATE TABLE IF NOT EXISTS Variants (
            variant_id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            size VARCHAR(50) NOT NULL,      
            stock_quantity INT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
          );
        `);
    console.log("Variants table created successfully!");
});
const insertInitialVariants = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(variantsPlaceholderData_1.productVariants.map((variant) => __awaiter(void 0, void 0, void 0, function* () {
        const [existingVariant] = yield connection.query("SELECT * FROM Variants WHERE variant_id = ?", [variant.variant_id]);
        if (existingVariant.length === 0) {
            yield connection.query(`INSERT INTO Variants (product_id, size, stock_quantity)
           VALUES (?, ?, ?);`, [variant.product_id, variant.size, variant.stock_quantity]);
            console.log(`Product ${variant.variant_id} inserted.`);
        }
        else {
            console.log(`Product ${variant.variant_id} already exists. Skipping.`);
        }
    })));
    console.log("Product insertion process completed!");
});
const createTablesForVariants = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield db_1.default.getConnection();
        yield createVariantsTable(connection);
        yield insertInitialVariants(connection);
    }
    catch (error) {
        console.error("Error creating tables or inserting user:", error);
    }
    finally {
        if (connection)
            connection.release();
    }
});
exports.default = createTablesForVariants;
