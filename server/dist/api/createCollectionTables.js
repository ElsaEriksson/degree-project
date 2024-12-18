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
const createCollectionsTable = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection.query(`
      CREATE TABLE IF NOT EXISTS Collections (
        collection_id INT AUTO_INCREMENT PRIMARY KEY,
        collection_name VARCHAR(255) NOT NULL UNIQUE,
        description_short VARCHAR(255) NOT NULL,
        description_long VARCHAR(355) NOT NULL
      );
    `);
    console.log("Collections table created successfully!");
});
const insertInitialCollections = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const collections = [
        [
            "Beigelace",
            "Understated elegance woven with intricate detail.",
            "Beigelace is a symphony of soft neutrals...",
        ],
        [
            "Colorfur",
            "A vivid expression of artistry in motion.",
            "Colorfur bursts with life, offering vibrant hues...",
        ],
        [
            "Howdy",
            "Where timeless Western charm meets couture elegance.",
            "Inspired by the rugged beauty of the frontier...",
        ],
    ];
    for (const collection of collections) {
        try {
            const [existingCollection] = yield connection.query(`SELECT * FROM Collections WHERE collection_name = ?`, [collection[0]]);
            if (existingCollection.length > 0) {
                console.log(`Collection ${collection[0]} already exists.`);
            }
            else {
                const [result] = yield connection.query(`INSERT INTO Collections (collection_name, description_short, description_long)
           VALUES (?, ?, ?)`, collection);
                console.log(`Collection ${collection[0]} added successfully with ID: ${result.insertId}`);
            }
        }
        catch (error) {
            console.error("Error inserting collection:", error.message);
        }
    }
});
const createTablesForCollections = () => __awaiter(void 0, void 0, void 0, function* () {
    let connection;
    try {
        connection = yield db_1.default.getConnection();
        yield createCollectionsTable(connection);
        yield insertInitialCollections(connection);
    }
    catch (error) {
        console.error("Error creating tables or inserting collection:", error);
    }
    finally {
        if (connection)
            connection.release();
    }
});
exports.default = createTablesForCollections;
