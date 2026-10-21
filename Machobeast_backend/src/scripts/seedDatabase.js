import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { ENV } from '../config/env.js';

const SEED_PRODUCTS = [
  {
    name: 'Divine Nutrition Icon Isolate 100% Whey Protein Isolate',
    brand: 'divine-nutrition',
    category: 'whey-isolate',
    description: 'Ultra-filtered 100% pure Whey Protein Isolate delivering 27g protein per scoop, zero added sugar, 0.5g fats, and loaded with EAAs & BCAAs for ultra-lean muscle building.',
    image: 'https://images.unsplash.com/photo-1622484211148-69e7a52df06e?w=600',
    price: 2799,
    mrp: 3499,
    rating: 4.8,
    numReviews: 2419,
    isVeg: true,
    isBestseller: true,
    stockQuantity: 120,
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Rich Chocolate', price: 2799, mrp: 3499, unitPrice: '₹280 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Rich Chocolate', price: 4999, mrp: 6499, unitPrice: '₹250 / 100 g' }
    ]
  },
  {
    name: 'Divine Nutrition Life Whey Protein (Concentrate & Isolate Blend)',
    brand: 'divine-nutrition',
    category: 'whey-protein',
    description: 'Premium Whey Concentrate & Isolate blend fortified with DigeZyme® digestive multi-enzyme complex for effortless digestion without bloating. Provides 25g protein and 5.5g BCAAs.',
    image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600',
    price: 2299,
    mrp: 2899,
    rating: 4.6,
    numReviews: 3120,
    isVeg: true,
    isBestseller: true,
    stockQuantity: 95,
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Belgian Chocolate', price: 2299, mrp: 2899, unitPrice: '₹230 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Belgian Chocolate', price: 4199, mrp: 5299, unitPrice: '₹210 / 100 g' }
    ]
  },
  {
    name: 'Wellcore 100% Pure Micronized Creatine Monohydrate',
    brand: 'wellcore',
    category: 'creatine',
    description: '100% Trustified micronized creatine monohydrate. Rapid ATP replenishment, explosive bench press & squat power, and cell hydration for muscle hypertrophy.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600',
    price: 849,
    mrp: 1199,
    rating: 4.9,
    numReviews: 4890,
    isVeg: true,
    isBestseller: true,
    stockQuantity: 200,
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 499, mrp: 699, unitPrice: '₹15 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 849, mrp: 1199, unitPrice: '₹10 / serving' }
    ]
  },
  {
    name: 'Alpino Superfoods Natural Peanut Butter High Protein Crunchy',
    brand: 'alpino',
    category: 'peanut-butter',
    description: 'Made from 100% roasted slow-ground non-GMO peanuts. Zero added sugar, zero salt, zero trans fats, and zero hydrogenated oils. 30g pure plant protein per 100g.',
    image: 'https://images.unsplash.com/photo-1612187209234-a73a1210e68c?w=600',
    price: 449,
    mrp: 599,
    rating: 4.8,
    numReviews: 3870,
    isVeg: true,
    isBestseller: true,
    stockQuantity: 150,
    variants: [
      { weight: '1 kg Jar', flavor: 'Crunchy Non-GMO', price: 449, mrp: 599, unitPrice: '₹45 / 100 g' },
      { weight: '2.5 kg Tub', flavor: 'Crunchy Non-GMO', price: 999, mrp: 1399, unitPrice: '₹40 / 100 g' }
    ]
  },
  {
    name: 'Maxures Heavy Duty Extreme Weight & Mass Gainer',
    brand: 'maxures',
    category: 'mass-gainer',
    description: 'Clinical grade high-calorie mass gainer formulated with complex carbohydrates, whey protein isolate, MCT healthy fats, and full vitamin mineral spectrum.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    price: 1899,
    mrp: 2499,
    rating: 4.6,
    numReviews: 1240,
    isVeg: true,
    isBestseller: false,
    stockQuantity: 75,
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate Avalanche', price: 1899, mrp: 2499, unitPrice: '₹190 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Chocolate Avalanche', price: 3499, mrp: 4699, unitPrice: '₹117 / 100 g' }
    ]
  },
  {
    name: 'Muscle Doctor Psychotic Rush Ultra Pre-Workout',
    brand: 'muscle-doctor',
    category: 'pre-workout',
    description: 'Intense sensory pre-workout formula with 300mg Caffeine Anhydrous, 4g Beta-Alanine, and 3g L-Citrulline Malate for skin-splitting muscle pumps and laser tunnel focus.',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600',
    price: 1249,
    mrp: 1799,
    rating: 4.7,
    numReviews: 920,
    isVeg: true,
    isBestseller: true,
    stockQuantity: 80,
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Blue Raspberry Shock', price: 1249, mrp: 1799, unitPrice: '₹42 / serving' }
    ]
  },
  {
    name: 'Absolute Nutrition Triple Strength Fish Oil Omega-3 1000mg',
    brand: 'absolute',
    category: 'vitamins',
    description: 'Molecularly distilled deep-sea cold water fish oil delivering 1000mg Omega-3 with 550mg EPA and 350mg DHA for cardiovascular health and joint lubrication.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600',
    price: 699,
    mrp: 999,
    rating: 4.8,
    numReviews: 1540,
    isVeg: false,
    isBestseller: false,
    stockQuantity: 110,
    variants: [
      { weight: '60 Softgels', flavor: 'Lemon Odorless', price: 699, mrp: 999, unitPrice: '₹12 / softgel' },
      { weight: '120 Softgels', flavor: 'Lemon Odorless', price: 1199, mrp: 1699, unitPrice: '₹10 / softgel' }
    ]
  }
];

const seedDatabase = async () => {
  console.log('\n======================================================');
  console.log('       MachoBeast Production Database Seeder          ');
  console.log('======================================================\n');

  try {
    await connectDB();

    // 1. Seed or Update Default Admin User
    console.log('[1/2] Seeding Default Admin Account...');
    const adminEmail = 'admin@machobeast.com';
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'MachoBeast Official Admin',
        email: adminEmail,
        password: 'Admin@12345',
        role: 'admin',
        phone: '9876543210'
      });
      console.log(`[Success] Created Admin Account: ${adminEmail} (Password: Admin@12345)`);
    } else {
      adminUser.role = 'admin';
      await adminUser.save();
      console.log(`[Info] Admin Account already exists: ${adminEmail}`);
    }

    // 2. Seed Supplement Catalog Products
    console.log('\n[2/2] Seeding Supplement Catalog into MongoDB Products Collection...');
    let insertedCount = 0;
    let updatedCount = 0;

    for (const prod of SEED_PRODUCTS) {
      const existing = await Product.findOne({ name: prod.name });
      if (!existing) {
        await Product.create(prod);
        insertedCount++;
      } else {
        await Product.findByIdAndUpdate(existing._id, prod);
        updatedCount++;
      }
    }

    const totalInDB = await Product.countDocuments();
    console.log(`\n[Summary] Products Inserted: ${insertedCount}`);
    console.log(`[Summary] Products Updated: ${updatedCount}`);
    console.log(`[Summary] Total Products in Database: ${totalInDB}`);

    console.log('\n------------------------------------------------------');
    console.log(' SUCCESS: Database seeding finished smoothly!');
    console.log('------------------------------------------------------\n');
  } catch (error) {
    console.error(`\n[Error] Database Seeding Failed: ${error.message}`);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

seedDatabase();
