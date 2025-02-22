import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controller/product.controller.js";
import protect from "../middleware/protect.js";
const router = express.Router();

router.post("/", protect, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
