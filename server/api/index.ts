import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoutes";
import collectionRoutes from "../routes/collectionRoutes";
import productRoutes from "../routes/productRoutes";
import variantRoutes from "../routes/variantRoutes";
import authRoutes from "../routes/authRoutes";
import createTablesForUsers from "./createUserTables";
import createTablesForCollections from "./createCollectionTables";
import createTablesForProducts from "./createProductTables";
import createTablesForVariants from "./createVariantTables";
import createTablesForCart from "./createCartTables";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

createTablesForUsers();
createTablesForCollections();
createTablesForProducts();
createTablesForVariants();
createTablesForCart();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world, updated!");
});

app.use("/api/users", userRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
