import { Cart } from '../models/cart.model.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';

const calculateTotals = (items = []) => {
  let totalQuantity = 0;
  let totalAmount = 0;
  items.forEach((item) => {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.price) || 0;
    totalQuantity += qty;
    totalAmount += price * qty;
  });
  return { totalQuantity, totalAmount };
};

// @desc    Get current user's cart
// @route   GET /api/v1/cart
// @access  Protected
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: []
      });
    }

    const { totalQuantity, totalAmount } = calculateTotals(cart.items);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: cart.items,
          totalQuantity,
          totalAmount
        },
        'Cart fetched successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Sync entire cart from frontend into database
// @route   POST /api/v1/cart/sync
// @access  Protected
export const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;

    if (!Array.isArray(items)) {
      return next(new ApiError(400, 'Items must be an array'));
    }

    // Clean and validate items
    const sanitizedItems = items.map((it) => ({
      id: String(it.id || it._id || ''),
      product: it.product || null,
      name: it.name || 'MachoBeast Product',
      brand: it.brand || '',
      variant: it.variant || '',
      price: Number(it.price) || 0,
      mrp: Number(it.mrp) || Number(it.price) || 0,
      image: it.image || '',
      quantity: Math.max(1, Number(it.quantity) || 1),
      isVeg: it.isVeg !== false
    }));

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: sanitizedItems
      });
    } else {
      cart.items = sanitizedItems;
    }

    await cart.save();

    const { totalQuantity, totalAmount } = calculateTotals(cart.items);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: cart.items,
          totalQuantity,
          totalAmount
        },
        'Cart synchronized successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/items
// @access  Protected
export const addToCart = async (req, res, next) => {
  try {
    const {
      id,
      product,
      name,
      brand,
      variant,
      price,
      mrp,
      image,
      quantity = 1,
      isVeg = true
    } = req.body;

    if (!id || !name || price === undefined) {
      return next(new ApiError(400, 'Product id, name, and price are required'));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemVariant = variant || '';
    const existingIndex = cart.items.findIndex(
      (item) => String(item.id) === String(id) && item.variant === itemVariant
    );

    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qtyToAdd;
    } else {
      cart.items.push({
        id: String(id),
        product: product || null,
        name,
        brand: brand || '',
        variant: itemVariant,
        price: Number(price),
        mrp: Number(mrp) || Number(price),
        image: image || '',
        quantity: qtyToAdd,
        isVeg: Boolean(isVeg)
      });
    }

    await cart.save();

    const { totalQuantity, totalAmount } = calculateTotals(cart.items);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: cart.items,
          totalQuantity,
          totalAmount
        },
        'Item added to cart'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of a cart item
// @route   PUT /api/v1/cart/items
// @access  Protected
export const updateCartItemQty = async (req, res, next) => {
  try {
    const { id, variant, quantity } = req.body;

    if (!id || quantity === undefined) {
      return next(new ApiError(400, 'Product id and quantity are required'));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError(404, 'Cart not found'));
    }

    const itemVariant = variant || '';
    const existingIndex = cart.items.findIndex(
      (item) => String(item.id) === String(id) && item.variant === itemVariant
    );

    if (existingIndex === -1) {
      return next(new ApiError(404, 'Item not found in cart'));
    }

    const newQty = Number(quantity);
    if (newQty <= 0) {
      // Remove item if quantity is zero or less
      cart.items.splice(existingIndex, 1);
    } else {
      cart.items[existingIndex].quantity = newQty;
    }

    await cart.save();

    const { totalQuantity, totalAmount } = calculateTotals(cart.items);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: cart.items,
          totalQuantity,
          totalAmount
        },
        'Cart item updated'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/v1/cart/items
// @access  Protected
export const removeFromCart = async (req, res, next) => {
  try {
    const { id, variant } = req.body;

    if (!id) {
      return next(new ApiError(400, 'Product id is required'));
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError(404, 'Cart not found'));
    }

    const itemVariant = variant || '';
    cart.items = cart.items.filter(
      (item) => !(String(item.id) === String(id) && item.variant === itemVariant)
    );

    await cart.save();

    const { totalQuantity, totalAmount } = calculateTotals(cart.items);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: cart.items,
          totalQuantity,
          totalAmount
        },
        'Item removed from cart'
      )
    );
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/v1/cart
// @access  Protected
export const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          items: [],
          totalQuantity: 0,
          totalAmount: 0
        },
        'Cart cleared successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

