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

    if (category && category !== 'all') {
      const catList = category.split(',').map((c) => c.trim()).filter(Boolean);
      if (catList.length === 1) {
        const escaped = catList[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = escaped.replace(/[- ]+/g, '[- ]?');
        query.category = new RegExp(`^${pattern}$`, 'i');
      } else if (catList.length > 1) {
        query.category = {
          $in: catList.map((c) => {
            const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = escaped.replace(/[- ]+/g, '[- ]?');
            return new RegExp(`^${pattern}$`, 'i');
          })
        };
      }
    }

    if (brand && brand !== 'all') {
      const brandList = brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brandList.length === 1) {
        const escaped = brandList[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.brand = new RegExp(`^${escaped}$`, 'i');
      } else if (brandList.length > 1) {
        query.brand = {
          $in: brandList.map((b) => {
            const escaped = b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`^${escaped}$`, 'i');
          })
        };
      }
    }

    if (search) {
      const cleanSearch = search.trim();
      const escaped = cleanSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = escaped.replace(/\s+/g, '[- ]?');
      const searchRegex = new RegExp(pattern, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex }
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories and product counts
// @route   GET /api/v1/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const countsMap = {};
    counts.forEach((item) => {
      if (item._id) countsMap[item._id] = item.count;
    });

    return res.status(200).json(
      new ApiResponse(200, { categories, counts: countsMap }, 'Categories fetched successfully')
    );
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
