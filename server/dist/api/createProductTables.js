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
const productsPlaceholderData_1 = require("./productsPlaceholderData");
const db_1 = __importDefault(require("../config/db"));
const createProductsTable = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.query(`
        CREATE TABLE IF NOT EXISTS Products (
          product_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,      
          main_image VARCHAR(455) NOT NULL,
          video VARCHAR(455) NOT NULL,
          additional_image VARCHAR(455) NOT NULL,
          collection_id INT NOT NULL,
          price INT NOT NULL,
          description_short VARCHAR(255) NOT NULL,
          description_long VARCHAR(355) NOT NULL,
          material VARCHAR(255) NOT NULL,
          gender VARCHAR(255) NOT NULL,
          season VARCHAR(255) NOT NULL,
          is_favorite BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (collection_id) REFERENCES Collections(collection_id) ON DELETE CASCADE
        );
      `);
    console.log("Products table created successfully!");
});
const insertInitialProducts = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(productsPlaceholderData_1.products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
        const [existingProduct] = yield connection.query("SELECT * FROM Products WHERE name = ?", [product.name]);
        if (existingProduct.length === 0) {
            yield connection.query(`INSERT INTO Products (name, main_image, video, additional_image, collection_id, price, description_short, description_long, material, gender, season)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
                product.name,
                product.mainImage,
                product.video,
                product.additionalImage,
                product.collection_id,
                product.price,
                product.description_short,
                product.description_long,
                product.material,
                product.gender,
                product.season,
            ]);
            console.log(`Product ${product.name} inserted.`);
        }
        else {
            console.log(`Product ${product.name} already exists. Skipping.`);
        }
    })));
    console.log("Product insertion process completed!");
});
const createTablesForProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield db_1.default.getConnection();
        yield createProductsTable(connection);
        yield insertInitialProducts(connection);
    }
    catch (error) {
        console.error("Error creating tables or inserting user:", error);
    }
    finally {
        if (connection)
            connection.release();
    }
});
exports.default = createTablesForProducts;
