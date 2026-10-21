import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by id
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }
    return res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (Admin)
// @route   POST /api/v1/products
// @access  Admin / Public for demo
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      image,
      price,
      mrp,
      isVeg,
      isBestseller,
      stockQuantity,
      variants
    } = req.body;

    if (!name || !brand || !category || !image || !price) {
      return next(new ApiError(400, 'Missing required product fields'));
    }

    const product = await Product.create({
      name,
      brand,
      category,
      description: description || `${name} premium supplement by ${brand}`,
      image,
      price: Number(price),
      mrp: Number(mrp) || Number(price),
      isVeg: isVeg !== false,
      isBestseller: !!isBestseller,
      stockQuantity: Number(stockQuantity) || 50,
      variants: variants && variants.length > 0 ? variants : [
        {
          weight: 'Standard',
          flavor: 'Regular',
          price: Number(price),
          mrp: Number(mrp) || Number(price),
          unitPrice: `₹${Math.round(price / 10)} / 100 g`
        }
      ]
    });

    return res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/v1/products/:id
// @access  Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    return res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/v1/products/:id
// @access  Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new ApiError(404, 'Product not found'));
    }

    return res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
  } catch (error) {
    next(error);
  }
};
