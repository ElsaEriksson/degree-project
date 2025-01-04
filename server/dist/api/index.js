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
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const cartRoutes_1 = __importDefault(require("../routes/cartRoutes"));
const checkoutRoutes_1 = __importDefault(require("../routes/checkoutRoutes"));
const createTables_1 = __importDefault(require("./createTables"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, createTables_1.default)();
app.get("/", (req, res) => {
    res.send("Hello world, updated!");
});
app.use("/users", userRoutes_1.default);
app.use("/api/collections", collectionRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/variants", variantRoutes_1.default);
app.use("/test", authRoutes_1.default);
app.use("/api/carts", cartRoutes_1.default);
app.use("/payment", checkoutRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
