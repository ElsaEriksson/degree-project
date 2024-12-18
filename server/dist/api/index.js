"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const collectionRoutes_1 = __importDefault(require("../routes/collectionRoutes"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const variantRoutes_1 = __importDefault(require("../routes/variantRoutes"));
const createUserTables_1 = __importDefault(require("./createUserTables"));
const createCollectionTables_1 = __importDefault(require("./createCollectionTables"));
const createProductTables_1 = __importDefault(require("./createProductTables"));
const createVariantTables_1 = __importDefault(require("./createVariantTables"));
const createCartTables_1 = __importDefault(require("./createCartTables"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, createUserTables_1.default)();
(0, createCollectionTables_1.default)();
(0, createProductTables_1.default)();
(0, createVariantTables_1.default)();
(0, createCartTables_1.default)();
app.get("/", (req, res) => {
    res.send("Hello world, updated!");
});
app.use("/api/users", userRoutes_1.default);
app.use("/api/collections", collectionRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/variants", variantRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
