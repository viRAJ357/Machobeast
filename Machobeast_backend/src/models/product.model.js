import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    weight: { type: String, required: true },
    flavor: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    unitPrice: { type: String }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    image: {
      type: String,
      required: [true, 'Product image URL is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required']
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required']
    },
    rating: {
      type: Number,
      default: 4.8
    },
    numReviews: {
      type: Number,
      default: 120
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      default: 50
    },
    variants: [variantSchema]
  },
  {
    timestamps: true
  }
);

// Production Indexes for high performance search & queries
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isBestseller: 1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model('Product', productSchema);
