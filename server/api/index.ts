import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import collectionRoutes from "../routes/collectionRoutes";
import productRoutes from "../routes/productRoutes";
import authRoutes from "../routes/authRoutes";
import cartRoutes from "../routes/cartRoutes";
import checkoutRoutes from "../routes/checkoutRoutes";
import orderRoutes from "../routes/orderRoutes";
import createTables from "./createTables";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

createTables();

app.use("/collections", collectionRoutes);
app.use("/", productRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/", checkoutRoutes);
app.use("/", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
