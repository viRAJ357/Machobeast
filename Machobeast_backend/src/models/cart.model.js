import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      default: ''
    },
    variant: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    mrp: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: ''
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    isVeg: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    items: [cartItemSchema]
  },
  {
    timestamps: true
  }
);

export const Cart = mongoose.model('Cart', cartSchema);

