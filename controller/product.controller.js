import Product from "../model/product.mode.js";
import CustomError from "../utils/CustomError.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const [updatedRows] = await Product.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRows === 0) {
      throw new CustomError("Product not found or no changes made", 404);
    }
    const updatedProduct = await Product.findByPk(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedRows = await Product.destroy({ where: { id: req.params.id } });
    if (deletedRows === 0) {
      throw new CustomError("Product not found", 404);
    }
    res.status(204).json("product deleted");
  } catch (error) {
    next(error);
  }
};
