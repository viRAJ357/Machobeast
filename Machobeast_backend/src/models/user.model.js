import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address'
      ]
    },
    password: {
      type: String,
      // Not required for OAuth users
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String,
      default: 'https://ui-avatars.com/api/?background=f59e0b&color=000&bold=true&name=User'
    },
    // OAuth provider fields
    provider: {
      type: String,
      enum: ['local', 'google', 'facebook'],
      default: 'local'
    },
    googleId: {
      type: String,
      default: null
    },
    facebookId: {
      type: String,
      default: null
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: { type: String, default: 'India' },
        isDefault: { type: Boolean, default: false }
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving (only for local users)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
