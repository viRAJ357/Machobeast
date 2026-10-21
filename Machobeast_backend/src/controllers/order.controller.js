import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/order.model.js';
import { ENV } from '../config/env.js';

// Lazy-initialized Razorpay instance
const getRazorpayInstance = () => {
  if (!ENV.RAZORPAY_KEY_ID || !ENV.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay API keys are not configured in environment variables.');
  }
  return new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET
  });
};

// @desc    Create Razorpay Order for client checkout
// @route   POST /api/v1/orders/razorpay-order
// @access  Public / Authenticated
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid order amount is required'
      });
    }

    const razorpay = getRazorpayInstance();

    // Razorpay requires amount in paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_mb_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        order: razorpayOrder,
        keyId: ENV.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & persist order in MongoDB
// @route   POST /api/v1/orders/verify-payment
// @access  Public / Authenticated
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      shippingAddress,
      totalAmount,
      guestEmail
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay verification parameters'
      });
    }

    // Generate expected HMAC SHA256 signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature'
      });
    }

    // Unique MachoBeast Order ID
    const customOrderId = `MB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Persist verified order into MongoDB Atlas
    const order = await Order.create({
      orderId: customOrderId,
      user: req.user?._id || null,
      guestEmail: guestEmail || (req.user ? req.user.email : 'guest@machobeast.com'),
      orderItems: (items || []).map((item) => ({
        product: item._id || null,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        variant: item.variant
      })),
      shippingAddress,
      paymentMethod: 'Razorpay',
      paymentResult: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        status: 'Captured',
        paidAt: new Date()
      },
      totalAmount,
      isPaid: true,
      paidAt: new Date(),
      orderStatus: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'Payment verified and Order placed successfully!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Cash on Delivery (COD) Order
// @route   POST /api/v1/orders/cod
// @access  Public / Authenticated
export const createCodOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, totalAmount, guestEmail } = req.body;

    const customOrderId = `MB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await Order.create({
      orderId: customOrderId,
      user: req.user?._id || null,
      guestEmail: guestEmail || (req.user ? req.user.email : 'guest@machobeast.com'),
      orderItems: (items || []).map((item) => ({
        product: item._id || null,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity || 1,
        variant: item.variant
      })),
      shippingAddress,
      paymentMethod: 'COD',
      paymentResult: {
        status: 'Pending'
      },
      totalAmount,
      isPaid: false,
      orderStatus: 'Confirmed'
    });

    res.status(201).json({
      success: true,
      message: 'COD Order placed successfully!',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin or current user)
// @route   GET /api/v1/orders
// @access  Public / Authenticated
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
