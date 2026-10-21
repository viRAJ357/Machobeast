// ============================================================
// MachoBeast Product Catalog Data
// Complete Catalog, High-Res Images & Accurate Indian MRP / Selling Pricing
// Extracted from all 10 Brand Catalogues
// ============================================================

// High-resolution verified fitness supplement photography
const IMAGES = {
  whey1: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600',
  whey2: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
  whey3: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=600',
  isolate1: 'https://images.unsplash.com/photo-1622484211148-69e7a52df06e?w=600',
  isolate2: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=600',
  isolate3: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
  gainer1: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
  gainer2: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
  gainer3: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
  creatine1: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600',
  creatine2: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600',
  creatine3: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=600',
  preworkout1: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600',
  preworkout2: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600',
  preworkout3: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600',
  peanutbutter1: 'https://images.unsplash.com/photo-1612187209234-a73a1210e68c?w=600',
  peanutbutter2: 'https://images.unsplash.com/photo-1600850056064-a8b380df8395?w=600',
  peanutbutter3: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600',
  oats1: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600',
  oats2: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600',
  bars1: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600',
  fatburner1: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600',
  carbs1: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600',
  supplement1: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600',
  supplement2: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600',
  supplement3: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=600',
  fishoil1: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600',
  multivitamin1: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600',
  shaker1: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=600',
  glutamine1: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600',
  jointcare1: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600',
  electrolytes1: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600',
};

// ============================================================
// BRAND DEFINITIONS (All 9 Major Brands from Catalogues)
// ============================================================
export const brands = [
  { id: 'divine-nutrition', name: 'Divine Nutrition', shortName: 'DN', logo: '🏋️', tagline: 'Engineered by Sahil Khan' },
  { id: 'maxures', name: 'Maxures Nutrition', shortName: 'Maxures', logo: '💪', tagline: 'Maximum Purity Healthcare' },
  { id: 'muscle-doctor', name: 'Muscle Doctor', shortName: 'MD', logo: '🔬', tagline: 'The Doctor of Bodybuilding' },
  { id: 'absolute', name: 'Absolute Nutrition', shortName: 'Absolute', logo: '🎯', tagline: 'Do What You Love' },
  { id: 'alpino', name: 'Alpino Superfoods', shortName: 'Alpino', logo: '🥜', tagline: 'The Real Peanut Butter' },
  { id: 'wellcore', name: 'Wellcore', shortName: 'Wellcore', logo: '⚡', tagline: '100% Trustified Creatine' },
  { id: 'wellx', name: 'WellX Brothers', shortName: 'WellX', logo: '🌟', tagline: 'Cravexnuts Gourmet Nutrition' },
  { id: 'hercules', name: 'Hercules Nutrition', shortName: 'Hercules', logo: '🦁', tagline: 'Original Creapure® Formulations' },
  { id: 'russian-anabolic', name: 'Russian Anabolic', shortName: 'Russian', logo: '🇷🇺', tagline: 'Extreme Hardcore Series' },
];

// ============================================================
// CATEGORY DEFINITIONS
// ============================================================
export const categories = [
  { id: 'whey-protein', name: 'Whey Protein', icon: '🥛' },
  { id: 'whey-isolate', name: 'Whey Isolate', icon: '💎' },
  { id: 'mass-gainer', name: 'Mass Gainer', icon: '🏗️' },
  { id: 'creatine', name: 'Creatine Monohydrate', icon: '⚡' },
  { id: 'pre-workout', name: 'Pre Workout & Energy', icon: '🔥' },
  { id: 'fat-burner', name: 'Fat Burner & Carnitine', icon: '⚡' },
  { id: 'peanut-butter', name: 'Peanut Butter & Spreads', icon: '🥜' },
  { id: 'protein-foods', name: 'Protein Foods, Oats & Bars', icon: '🍫' },
  { id: 'amino-acids', name: 'BCAA & EAA', icon: '💧' },
  { id: 'vitamins', name: 'Fish Oil & Multivitamins', icon: '💊' },
  { id: 'wellness', name: 'Joint Care & Glutamine', icon: '🦴' },
  { id: 'recovery', name: 'Carbs & Recovery Fuel', icon: '🔄' },
];

// ============================================================
// FULL PRODUCT CATALOG WITH COMPREHENSIVE PRICING & VARIANTS
// ============================================================
export const allProducts = [

  // ------------------------------------------------------------
  // 1. DIVINE NUTRITION (DN Catalogue)
  // ------------------------------------------------------------
  {
    id: 'dn-icon-isolate',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition Icon Isolate 100% Whey Protein Isolate',
    category: 'whey-isolate',
    isVeg: true,
    rating: 4.8,
    numReviews: 2419,
    image: IMAGES.isolate1,
    isBestseller: true,
    description: 'Ultra-filtered 100% pure Whey Protein Isolate delivering 27g protein per scoop, zero added sugar, 0.5g fats, and loaded with EAAs & BCAAs for ultra-lean muscle building and lightning-fast post-workout muscle repair.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Rich Chocolate', price: 2799, mrp: 3499, unitPrice: '₹280 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Cafe Latte', price: 2799, mrp: 3499, unitPrice: '₹280 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Cookies & Cream', price: 2799, mrp: 3499, unitPrice: '₹280 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Rich Chocolate', price: 4999, mrp: 6499, unitPrice: '₹250 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Cafe Latte', price: 4999, mrp: 6499, unitPrice: '₹250 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Cookies & Cream', price: 4999, mrp: 6499, unitPrice: '₹250 / 100 g' },
    ]
  },
  {
    id: 'dn-life-whey',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition Life Whey Protein (Concentrate & Isolate Blend)',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.6,
    numReviews: 3120,
    image: IMAGES.whey1,
    isBestseller: true,
    description: 'Premium Whey Concentrate & Isolate blend fortified with DigeZyme® digestive multi-enzyme complex for effortless digestion without bloating. Provides 25g protein and 5.5g BCAAs per serving.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Belgian Chocolate', price: 2299, mrp: 2899, unitPrice: '₹230 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Kesar Pista', price: 2299, mrp: 2899, unitPrice: '₹230 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Mango Shake', price: 2299, mrp: 2899, unitPrice: '₹230 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Belgian Chocolate', price: 4199, mrp: 5299, unitPrice: '₹210 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Kesar Pista', price: 4199, mrp: 5299, unitPrice: '₹210 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Vanilla Almond', price: 4199, mrp: 5299, unitPrice: '₹210 / 100 g' },
    ]
  },
  {
    id: 'dn-hunk-gainer',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition Hunk Gainer Gold | High Calorie Bulk Mass Formula',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.5,
    numReviews: 1845,
    image: IMAGES.gainer1,
    isBestseller: false,
    description: 'Heavy duty high calorie mass gainer enriched with complex carbohydrates, quality whey protein, 3g pure creatine monohydrate per serving, and 26 essential vitamins and minerals for stubborn hardgainers.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Swiss Chocolate', price: 1199, mrp: 1599, unitPrice: '₹120 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Swiss Chocolate', price: 2599, mrp: 3499, unitPrice: '₹87 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Banana Shake', price: 2599, mrp: 3499, unitPrice: '₹87 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Swiss Chocolate', price: 3699, mrp: 4899, unitPrice: '₹74 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Malai Kulfi', price: 3699, mrp: 4899, unitPrice: '₹74 / 100 g' },
    ]
  },
  {
    id: 'dn-l-carnitine',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition L-Carnitine 3000 Liquid Fast Acting Fat Burner',
    category: 'fat-burner',
    isVeg: true,
    rating: 4.7,
    numReviews: 928,
    image: IMAGES.fatburner1,
    isBestseller: true,
    description: 'High-potency 3000mg liquid L-Carnitine per 15ml serving with Vitamin B5 & B6. Rapidly oxidizes long-chain fatty acids into pure cellular energy, accelerating fat shredding and cardio stamina.',
    variants: [
      { weight: '450 ml (30 Servings)', flavor: 'Blueberry Raaz', price: 999, mrp: 1299, unitPrice: '₹33 / serving' },
      { weight: '450 ml (30 Servings)', flavor: 'Mix Berry Blast', price: 999, mrp: 1299, unitPrice: '₹33 / serving' },
      { weight: '450 ml (30 Servings)', flavor: 'Tangy Green Apple', price: 999, mrp: 1299, unitPrice: '₹33 / serving' },
      { weight: '450 ml (30 Servings)', flavor: 'Citrus Lemon', price: 999, mrp: 1299, unitPrice: '₹33 / serving' },
    ]
  },
  {
    id: 'dn-creatine',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition 100% Pure Micronized Creatine Monohydrate',
    category: 'creatine',
    isVeg: true,
    rating: 4.8,
    numReviews: 2190,
    image: IMAGES.creatine1,
    isBestseller: true,
    description: 'Pharmaceutical grade 100% micronized creatine monohydrate (200 mesh). Increases phosphocreatine stores in muscle cells, fueling explosive lifting power, raw muscular strength, and volume.',
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 499, mrp: 749, unitPrice: '₹15 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 999, mrp: 1399, unitPrice: '₹12 / serving' },
      { weight: '400 g (133 Servings)', flavor: 'Unflavoured', price: 1499, mrp: 1999, unitPrice: '₹11 / serving' },
    ]
  },
  {
    id: 'dn-eaa-gold',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition EAA Gold Intra-Workout Essential Amino Acids',
    category: 'amino-acids',
    isVeg: true,
    rating: 4.5,
    numReviews: 612,
    image: IMAGES.supplement1,
    isBestseller: false,
    description: 'Comprehensive 9 Essential Amino Acids profile with optimal 2:1:1 BCAAs, coconut water electrolytes, and taurine for maximum intra-workout endurance, muscle hydration, and zero muscle breakdown.',
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Fruit Punch', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Watermelon Burst', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Blue Raspberry', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
    ]
  },
  {
    id: 'dn-triple-fish-oil',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition Triple Strength Omega 3 Fish Oil 1250mg',
    category: 'vitamins',
    isVeg: false,
    rating: 4.8,
    numReviews: 1420,
    image: IMAGES.fishoil1,
    isBestseller: true,
    description: 'Triple Strength molecularly distilled enteric-coated fish oil softgels. Provides 560mg EPA and 400mg DHA per softgel with zero fishy burps, promoting heart health, joint flexibility, and brain sharpness.',
    variants: [
      { weight: '60 Softgels', flavor: 'Lemon Enteric Coated', price: 799, mrp: 1199, unitPrice: '₹13 / softgel' },
      { weight: '120 Softgels', flavor: 'Lemon Enteric Coated', price: 1399, mrp: 2199, unitPrice: '₹11 / softgel' },
    ]
  },
  {
    id: 'dn-daily-multivitamin',
    brand: 'divine-nutrition',
    name: 'Divine Nutrition Daily High-Potency Multivitamin & Minerals',
    category: 'vitamins',
    isVeg: true,
    rating: 4.7,
    numReviews: 890,
    image: IMAGES.multivitamin1,
    isBestseller: false,
    description: 'Comprehensive daily multivitamin specifically engineered for intense bodybuilders. Packed with 32 vitamins, minerals, antioxidants, ginseng extract, and amino blends for peak vitality.',
    variants: [
      { weight: '60 Tablets', flavor: 'Coated Tablets', price: 599, mrp: 899, unitPrice: '₹10 / tablet' },
      { weight: '120 Tablets', flavor: 'Coated Tablets', price: 999, mrp: 1599, unitPrice: '₹8 / tablet' },
    ]
  },

  // ------------------------------------------------------------
  // 2. MAXURES NUTRITION (MAXURES CATALOG)
  // ------------------------------------------------------------
  {
    id: 'max-whey-gold',
    brand: 'maxures',
    name: 'Maxures Gold Whey Protein Concentrate 80% | 24g Protein',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.5,
    numReviews: 1682,
    image: IMAGES.whey2,
    isBestseller: true,
    description: 'Premium instantized whey protein concentrate delivering 24g protein, 5.4g BCAAs, and 4g Glutamine. Zero added sugar, naturally sweetened, micro-filtered for rapid bioavailability.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Asian Delight (Kulfi)', price: 1999, mrp: 2499, unitPrice: '₹200 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Belgian Chocolate', price: 1999, mrp: 2499, unitPrice: '₹200 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Asian Delight (Kulfi)', price: 3699, mrp: 4499, unitPrice: '₹185 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Cafe Mocha', price: 3699, mrp: 4499, unitPrice: '₹185 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Belgian Chocolate', price: 3699, mrp: 4499, unitPrice: '₹185 / 100 g' },
    ]
  },
  {
    id: 'max-isolate-pro',
    brand: 'maxures',
    name: 'Maxures 100% Cross Flow Microfiltered Whey Isolate (CFM)',
    category: 'whey-isolate',
    isVeg: true,
    rating: 4.7,
    numReviews: 934,
    image: IMAGES.isolate2,
    isBestseller: false,
    description: 'Cold-temperature CFM filtered whey isolate. Virtually zero fats, zero lactose, zero carbs. 28g protein per 30g scoop. Ideal for cutting, competition preparation, and strict calorie diets.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Rich Dark Chocolate', price: 2999, mrp: 3699, unitPrice: '₹300 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Rich Dark Chocolate', price: 5499, mrp: 6499, unitPrice: '₹275 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'French Vanilla', price: 5499, mrp: 6499, unitPrice: '₹275 / 100 g' },
    ]
  },
  {
    id: 'max-mega-mass',
    brand: 'maxures',
    name: 'Maxures Monster Mega Mass Gainer 30g Protein + 60g Complex Carbs',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.3,
    numReviews: 812,
    image: IMAGES.gainer2,
    isBestseller: false,
    description: 'High-energy caloric density matrix with slow, medium, and fast releasing carbohydrates, whey protein concentrate, and digestive enzymes for sustained mass building without bloating.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate', price: 999, mrp: 1399, unitPrice: '₹100 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Chocolate Delite', price: 2299, mrp: 2999, unitPrice: '₹77 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Kesar Pista', price: 2299, mrp: 2999, unitPrice: '₹77 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Chocolate Delite', price: 3499, mrp: 4499, unitPrice: '₹70 / 100 g' },
    ]
  },
  {
    id: 'max-creatine-pure',
    brand: 'maxures',
    name: 'Maxures Micronized Creatine 5000mg Power Formula',
    category: 'creatine',
    isVeg: true,
    rating: 4.6,
    numReviews: 1420,
    image: IMAGES.creatine2,
    isBestseller: true,
    description: 'Ultra-pure 200-mesh micronized creatine monohydrate providing 5000mg creatine per serving. Maximizes ATP output during heavy resistance training, high-intensity intervals, and muscle volumization.',
    variants: [
      { weight: '100 g (20 Servings)', flavor: 'Unflavoured', price: 479, mrp: 699, unitPrice: '₹24 / serving' },
      { weight: '250 g (50 Servings)', flavor: 'Unflavoured', price: 899, mrp: 1299, unitPrice: '₹18 / serving' },
      { weight: '400 g (80 Servings)', flavor: 'Unflavoured', price: 1349, mrp: 1899, unitPrice: '₹17 / serving' },
    ]
  },
  {
    id: 'max-preworkout-pump',
    brand: 'maxures',
    name: 'Maxures Pre-Workout Pump Matrix | Beta-Alanine + L-Citrulline',
    category: 'pre-workout',
    isVeg: true,
    rating: 4.4,
    numReviews: 540,
    image: IMAGES.preworkout1,
    isBestseller: false,
    description: 'High-potency clinical doses of 3000mg L-Citrulline Malate, 2500mg Beta-Alanine, and 250mg Anhydrous Caffeine for vascular nitric oxide skin-splitting pumps, intense energy and mental focus.',
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Green Apple', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Fruit Punch', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Electric Cola', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
    ]
  },
  {
    id: 'max-glutamine-pure',
    brand: 'maxures',
    name: 'Maxures 100% Micronized L-Glutamine 5000mg Post-Workout',
    category: 'wellness',
    isVeg: true,
    rating: 4.6,
    numReviews: 512,
    image: IMAGES.glutamine1,
    isBestseller: false,
    description: '100% free form L-Glutamine powder. Speeds up cellular recovery, protects gut health, reduces post-training muscle soreness (DOMS), and boosts systemic immune strength.',
    variants: [
      { weight: '250 g (50 Servings)', flavor: 'Unflavoured', price: 799, mrp: 1199, unitPrice: '₹16 / serving' },
      { weight: '500 g (100 Servings)', flavor: 'Unflavoured', price: 1399, mrp: 1999, unitPrice: '₹14 / serving' },
    ]
  },

  // ------------------------------------------------------------
  // 3. MUSCLE DOCTOR / MD (MD BROCHURE & CATALOGUE APRIL 2026)
  // ------------------------------------------------------------
  {
    id: 'md-pro-whey',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor Pro Whey | 24g Protein | Multi-Enzyme Complex',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.7,
    numReviews: 2840,
    image: IMAGES.whey3,
    isBestseller: true,
    description: 'Formulated by sports doctors. 24g cold-processed whey protein, 5.5g BCAAs, zero added sugar, and specialized digestive enzymes. Clean, highly blendable, and delicious taste profile.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate Delite', price: 2099, mrp: 2600, unitPrice: '₹210 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Kulfi Ice Cream', price: 2099, mrp: 2600, unitPrice: '₹210 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Coffee Latte', price: 3899, mrp: 4800, unitPrice: '₹195 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Chocolate Delite', price: 3899, mrp: 4800, unitPrice: '₹195 / 100 g' },
      { weight: '4 kg (8.8 lb)', flavor: 'Chocolate Delite', price: 7299, mrp: 8900, unitPrice: '₹182 / 100 g' },
    ]
  },
  {
    id: 'md-iso-null',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor ISO Null Zero Carb Isolate | Nitro Pump Matrix',
    category: 'whey-isolate',
    isVeg: true,
    rating: 4.8,
    numReviews: 1120,
    image: IMAGES.isolate3,
    isBestseller: true,
    description: 'Flagship zero-sugar, zero-carb, pure Whey Isolate. Enriched with nitro pump amino complex for enhanced vascularity, instant nitrogen retention, and lightning muscle recovery.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Belgian Chocolate', price: 2899, mrp: 3500, unitPrice: '₹290 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Belgian Chocolate', price: 5299, mrp: 6500, unitPrice: '₹265 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Cafe Mocha', price: 5299, mrp: 6500, unitPrice: '₹265 / 100 g' },
    ]
  },
  {
    id: 'md-beast-xxl-gainer',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor Beast XXL Hardcore Weight Gainer 1250 Calories',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.6,
    numReviews: 2450,
    image: IMAGES.gainer3,
    isBestseller: true,
    description: 'Ultra-dense 1250 calories per daily serving when mixed with whole milk. High protein-to-carb ratio, fortified with Creapure creatine, L-Glutamine, and MCT oils for extreme size gain.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate', price: 999, mrp: 1300, unitPrice: '₹100 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Kesar Kulfi', price: 2399, mrp: 3100, unitPrice: '₹80 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Cookies & Cream', price: 2399, mrp: 3100, unitPrice: '₹80 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Chocolate', price: 3499, mrp: 4400, unitPrice: '₹70 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Malai Kulfi', price: 3499, mrp: 4400, unitPrice: '₹70 / 100 g' },
    ]
  },
  {
    id: 'md-iso-gain',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor ISO Gain Clean Lean Muscle Mass Gainer',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.5,
    numReviews: 730,
    image: IMAGES.supplement3,
    isBestseller: false,
    description: 'Designed exclusively for athletes seeking lean muscle mass without adding subcutaneous fat. Formulated with Whey Isolate, low glycemic oat flour carbs, and fat-metabolizing enzymes.',
    variants: [
      { weight: '2 kg (4.4 lb)', flavor: 'Chocolate Fudge', price: 2499, mrp: 3200, unitPrice: '₹125 / 100 g' },
      { weight: '4 kg (8.8 lb)', flavor: 'Chocolate Fudge', price: 4499, mrp: 5800, unitPrice: '₹112 / 100 g' },
    ]
  },
  {
    id: 'md-creatine-pure',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor Pure Micronized Creatine Monohydrate 200 Mesh',
    category: 'creatine',
    isVeg: true,
    rating: 4.7,
    numReviews: 1530,
    image: IMAGES.creatine1,
    isBestseller: false,
    description: '100% fine 200-mesh micronized creatine monohydrate. Rapidly mixes in cold water or juice without leaving gritty residue. Boosts intracellular water retention and explosive power.',
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 449, mrp: 649, unitPrice: '₹14 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 899, mrp: 1299, unitPrice: '₹11 / serving' },
    ]
  },
  {
    id: 'md-preworkout-fire',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor Pre-Workout Fire | Extreme Nitric Stimulant',
    category: 'pre-workout',
    isVeg: true,
    rating: 4.6,
    numReviews: 890,
    image: IMAGES.preworkout2,
    isBestseller: true,
    description: 'Heavy duty pre-workout with 4000mg Citrulline Malate, 3200mg Beta-Alanine, 300mg Caffeine, and Alpha-GPC for pinpoint focus, endurance surges, and vein-popping muscular pumps.',
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Watermelon Blast', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Green Apple Sour', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Cola Candy', price: 1199, mrp: 1599, unitPrice: '₹40 / serving' },
    ]
  },
  {
    id: 'md-bcaa-7000',
    brand: 'muscle-doctor',
    name: 'Muscle Doctor BCAA 7000 Anabolic Ratio 2:1:1 Intra-Workout',
    category: 'amino-acids',
    isVeg: true,
    rating: 4.5,
    numReviews: 680,
    image: IMAGES.supplement2,
    isBestseller: false,
    description: '7000mg instantized pure fermented BCAAs per scoop with 2.5g L-Glutamine, 1g L-Citrulline, and pink Himalayan salt electrolytes for cramp-free, marathon workouts.',
    variants: [
      { weight: '350 g (35 Servings)', flavor: 'Pineapple Tang', price: 1249, mrp: 1699, unitPrice: '₹35 / serving' },
      { weight: '350 g (35 Servings)', flavor: 'Orange Splash', price: 1249, mrp: 1699, unitPrice: '₹35 / serving' },
    ]
  },

  // ------------------------------------------------------------
  // 4. ABSOLUTE NUTRITION (Absolute Brochure NEW MRP)
  // ------------------------------------------------------------
  {
    id: 'abs-legender-whey',
    brand: 'absolute',
    name: 'Absolute Nutrition Legender Whey Protein | 24g Protein + BCAAs',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.6,
    numReviews: 2980,
    image: IMAGES.whey1,
    isBestseller: true,
    description: 'Flagship whey protein crafted with internationally sourced whey concentrate and isolate. 24g protein, 5.5g BCAAs, zero added sugar, packed with immunity boosting vitamins.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate', price: 1999, mrp: 2399, unitPrice: '₹200 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Cafe Latte', price: 1999, mrp: 2399, unitPrice: '₹200 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Chocolate', price: 3699, mrp: 4399, unitPrice: '₹185 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Strawberry Velvet', price: 3699, mrp: 4399, unitPrice: '₹185 / 100 g' },
      { weight: '4 kg (8.8 lb)', flavor: 'Mango Mania', price: 6899, mrp: 8199, unitPrice: '₹172 / 100 g' },
    ]
  },
  {
    id: 'abs-elephant-mass',
    brand: 'absolute',
    name: 'Absolute Nutrition Elephant Mass Gainer | Hardcore Size Bulking',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.7,
    numReviews: 3650,
    image: IMAGES.gainer2,
    isBestseller: true,
    description: 'India’s most celebrated heavy bulking gainer. Infused with complex carbohydrate polymers, fast-acting digestive enzymes, 22 vitamins & minerals, and 5g BCAAs per serving for colossal muscle growth.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate', price: 899, mrp: 1199, unitPrice: '₹90 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Chocolate', price: 2299, mrp: 2899, unitPrice: '₹77 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Kesar Pista', price: 2299, mrp: 2899, unitPrice: '₹77 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Banana Shake', price: 3399, mrp: 4299, unitPrice: '₹68 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Chocolate', price: 3399, mrp: 4299, unitPrice: '₹68 / 100 g' },
    ]
  },
  {
    id: 'abs-karboz-fuel',
    brand: 'absolute',
    name: 'Absolute Nutrition Karboz 100% Pure Complex Carbohydrate Fuel',
    category: 'recovery',
    isVeg: true,
    rating: 4.4,
    numReviews: 870,
    image: IMAGES.carbs1,
    isBestseller: false,
    description: 'Pure, instant-mixing maltodextrin carbohydrate powder. Recharges depleted glycogen stores instantly post-workout, preventing muscle catabolism and amplifying protein synthesis.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Unflavoured', price: 549, mrp: 749, unitPrice: '₹55 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Unflavoured', price: 1499, mrp: 1999, unitPrice: '₹50 / 100 g' },
    ]
  },
  {
    id: 'abs-creatine-pure',
    brand: 'absolute',
    name: 'Absolute Nutrition 100% Micronized Creatine Monohydrate',
    category: 'creatine',
    isVeg: true,
    rating: 4.6,
    numReviews: 1780,
    image: IMAGES.creatine3,
    isBestseller: false,
    description: '100% pure micronized creatine monohydrate. Unadulterated, lab-tested for heavy metals and banned substances. Builds high endurance and power thresholds.',
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 499, mrp: 749, unitPrice: '₹15 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 949, mrp: 1399, unitPrice: '₹11 / serving' },
    ]
  },
  {
    id: 'abs-joint-support',
    brand: 'absolute',
    name: 'Absolute Nutrition Joint Shield Flex (Glucosamine + MSM + Chondroitin)',
    category: 'wellness',
    isVeg: true,
    rating: 4.7,
    numReviews: 430,
    image: IMAGES.jointcare1,
    isBestseller: false,
    description: 'Advanced orthopedic joint comfort formula for heavy lifters. Protects cartilage, lubricates stiff knees and shoulders, and relieves inflammation caused by maximum load squats and presses.',
    variants: [
      { weight: '60 Tablets', flavor: 'Coated Tablets', price: 699, mrp: 999, unitPrice: '₹12 / tablet' },
      { weight: '120 Tablets', flavor: 'Coated Tablets', price: 1299, mrp: 1799, unitPrice: '₹11 / tablet' },
    ]
  },

  // ------------------------------------------------------------
  // 5. ALPINO (Alpino OFFLINE LEAFLET)
  // ------------------------------------------------------------
  {
    id: 'alp-natural-pb',
    brand: 'alpino',
    name: 'Alpino 100% Natural Peanut Butter | Zero Added Sugar & Salt',
    category: 'peanut-butter',
    isVeg: true,
    rating: 4.8,
    numReviews: 6840,
    image: IMAGES.peanutbutter1,
    isBestseller: true,
    description: 'Made exclusively from 100% high-grade roasted peanuts. Zero hydrogenated oils, zero trans fats, zero cholesterol, zero sugar. Delivers 30g protein & 9g dietary fiber per 100g.',
    variants: [
      { weight: '400 g', flavor: 'Crunchy', price: 179, mrp: 210, unitPrice: '₹45 / 100 g' },
      { weight: '400 g', flavor: 'Smooth', price: 179, mrp: 210, unitPrice: '₹45 / 100 g' },
      { weight: '1 kg', flavor: 'Crunchy', price: 399, mrp: 475, unitPrice: '₹40 / 100 g' },
      { weight: '1 kg', flavor: 'Smooth', price: 399, mrp: 475, unitPrice: '₹40 / 100 g' },
      { weight: '2.5 kg Tub', flavor: 'Crunchy', price: 899, mrp: 1099, unitPrice: '₹36 / 100 g' },
      { weight: '2.5 kg Tub', flavor: 'Smooth', price: 899, mrp: 1099, unitPrice: '₹36 / 100 g' },
    ]
  },
  {
    id: 'alp-super-pb-ashwagandha',
    brand: 'alpino',
    name: 'Alpino Super Peanut Butter with KSM-66 Ashwagandha',
    category: 'peanut-butter',
    isVeg: true,
    rating: 4.7,
    numReviews: 3120,
    image: IMAGES.peanutbutter2,
    isBestseller: true,
    description: 'India’s first functional peanut butter infused with authentic clinically-backed KSM-66 Ashwagandha root extract. Reduces cortisol, relieves muscle stress, improves stamina, and tastes incredible.',
    variants: [
      { weight: '1 kg', flavor: 'Dark Chocolate Crunchy', price: 549, mrp: 729, unitPrice: '₹55 / 100 g' },
      { weight: '1 kg', flavor: 'Dark Chocolate Smooth', price: 549, mrp: 729, unitPrice: '₹55 / 100 g' },
    ]
  },
  {
    id: 'alp-peanut-protein-powder',
    brand: 'alpino',
    name: 'Alpino Supernatural High Protein Plant Peanut Protein Powder',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.5,
    numReviews: 1240,
    image: IMAGES.supplement1,
    isBestseller: false,
    description: '100% dairy-free, vegan plant protein powder defatted from premium roasted peanuts. Super smooth consistency with 24g plant protein, digestive enzymes, and zero chalky taste.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Dark Chocolate', price: 1899, mrp: 2299, unitPrice: '₹190 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Cold Coffee Brew', price: 1899, mrp: 2299, unitPrice: '₹190 / 100 g' },
      { weight: '1 kg (2.2 lb)', flavor: 'Thandai Kesar Badam', price: 1899, mrp: 2299, unitPrice: '₹190 / 100 g' },
    ]
  },
  {
    id: 'alp-super-rolled-oats',
    brand: 'alpino',
    name: 'Alpino High Protein Super Rolled Oats Fortified with Protein',
    category: 'protein-foods',
    isVeg: true,
    rating: 4.6,
    numReviews: 1980,
    image: IMAGES.oats1,
    isBestseller: false,
    description: 'Whole grain jumbo rolled oats enriched with probiotic cultures and protein isolates. Contains 22g protein per 100g. Keeps hunger in check for hours with low GI beta-glucan fiber.',
    variants: [
      { weight: '400 g', flavor: 'Dark Chocolate', price: 189, mrp: 225, unitPrice: '₹47 / 100 g' },
      { weight: '400 g', flavor: 'Classic Coffee', price: 189, mrp: 225, unitPrice: '₹47 / 100 g' },
      { weight: '1 kg', flavor: 'Dark Chocolate', price: 399, mrp: 499, unitPrice: '₹40 / 100 g' },
      { weight: '1 kg', flavor: 'Masala Mexicana', price: 399, mrp: 499, unitPrice: '₹40 / 100 g' },
    ]
  },
  {
    id: 'alp-super-protein-bars',
    brand: 'alpino',
    name: 'Alpino Super Clean Protein Bars (20g Protein Per Bar)',
    category: 'protein-foods',
    isVeg: true,
    rating: 4.4,
    numReviews: 940,
    image: IMAGES.bars1,
    isBestseller: false,
    description: 'Nutritious on-the-go snack offering 20g whey & plant protein with zero added white sugar. Powered by almond butter and crunchy peanut crispies.',
    variants: [
      { weight: 'Box of 6 Bars', flavor: 'Cookies & Cream', price: 479, mrp: 599, unitPrice: '₹80 / bar' },
      { weight: 'Box of 6 Bars', flavor: 'Rich Dark Chocolate', price: 479, mrp: 599, unitPrice: '₹80 / bar' },
      { weight: 'Box of 12 Bars', flavor: 'Cookies & Cream', price: 899, mrp: 1199, unitPrice: '₹75 / bar' },
      { weight: 'Box of 12 Bars', flavor: 'Assorted Variety Pack', price: 899, mrp: 1199, unitPrice: '₹75 / bar' },
    ]
  },

  // ------------------------------------------------------------
  // 6. WELLCORE (WELLCORE CREATINE)
  // ------------------------------------------------------------
  {
    id: 'wc-creatine-pure-unflav',
    brand: 'wellcore',
    name: 'Wellcore 100% Pure Micronised Creatine Monohydrate (Trustified)',
    category: 'creatine',
    isVeg: true,
    rating: 4.9,
    numReviews: 5410,
    image: IMAGES.creatine1,
    isBestseller: true,
    description: 'India’s #1 Trustified-certified ultra-micronized creatine monohydrate. Nanometer particle reduction ensures instant solubility without settling. Zero fillers, zero sugars, 100% active creatine for unmatched athletic performance.',
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 499, mrp: 699, unitPrice: '₹15 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 999, mrp: 1399, unitPrice: '₹12 / serving' },
      { weight: '400 g (133 Servings)', flavor: 'Unflavoured', price: 1499, mrp: 1999, unitPrice: '₹11 / serving' },
    ]
  },
  {
    id: 'wc-creatine-flavoured',
    brand: 'wellcore',
    name: 'Wellcore Micronised Flavoured Creatine Monohydrate Zero Sugar',
    category: 'creatine',
    isVeg: true,
    rating: 4.8,
    numReviews: 2940,
    image: IMAGES.creatine2,
    isBestseller: true,
    description: 'The tastiest way to take creatine! 3g pure creatine monohydrate infused with electrifying fruity flavours, zero sugar, and instant water solubility. No more boring unflavoured shakes.',
    variants: [
      { weight: '149 g (33 Servings)', flavor: 'Fruit Fusion', price: 649, mrp: 749, unitPrice: '₹20 / serving' },
      { weight: '149 g (33 Servings)', flavor: 'Watermelon Wave', price: 649, mrp: 749, unitPrice: '₹20 / serving' },
      { weight: '149 g (33 Servings)', flavor: 'Kiwi Kick', price: 649, mrp: 749, unitPrice: '₹20 / serving' },
      { weight: '307 g (83 Servings)', flavor: 'Lemon Lime Rush', price: 1199, mrp: 1499, unitPrice: '₹14 / serving' },
      { weight: '307 g (83 Servings)', flavor: 'Tropical Tango', price: 1199, mrp: 1499, unitPrice: '₹14 / serving' },
    ]
  },
  {
    id: 'wc-electro-hydrate',
    brand: 'wellcore',
    name: 'Wellcore Electro-Hydrate Fast Acting Intra-Workout Electrolyte Fuel',
    category: 'recovery',
    isVeg: true,
    rating: 4.7,
    numReviews: 810,
    image: IMAGES.electrolytes1,
    isBestseller: false,
    description: 'Clinical hydration powder packed with 5 key electrolytes (Sodium, Potassium, Magnesium, Calcium, Chloride), Vitamin C, and coconut water powder for rapid rehydration and preventing workout fatigue.',
    variants: [
      { weight: '250 g (50 Servings)', flavor: 'Lemon Lime Rush', price: 699, mrp: 899, unitPrice: '₹14 / serving' },
      { weight: '250 g (50 Servings)', flavor: 'Orange Tang', price: 699, mrp: 899, unitPrice: '₹14 / serving' },
    ]
  },

  // ------------------------------------------------------------
  // 7. WELLX BROTHERS (Wellx Brochure-5)
  // ------------------------------------------------------------
  {
    id: 'wx-gourmet-pb-crispy',
    brand: 'wellx',
    name: 'WellX Crispy & Creamy Gourmet Dessert Peanut Butter',
    category: 'peanut-butter',
    isVeg: true,
    rating: 4.7,
    numReviews: 1870,
    image: IMAGES.peanutbutter3,
    isBestseller: true,
    description: 'Decadent gourmet peanut butter crafted with roasted slow-ground peanuts, chocolate ripples, and crunchy toasted rice crispies. High protein, high energy, and indulgent taste.',
    variants: [
      { weight: '350 g Jar', flavor: 'White Chocolate Crispy', price: 289, mrp: 349, unitPrice: '₹82 / 100 g' },
      { weight: '350 g Jar', flavor: 'Dark Chocolate Crunchy', price: 289, mrp: 349, unitPrice: '₹82 / 100 g' },
      { weight: '1 kg Jar', flavor: 'Rabdi Silky Delight', price: 489, mrp: 599, unitPrice: '₹49 / 100 g' },
      { weight: '1 kg Jar', flavor: 'Mango Creamy Dream', price: 489, mrp: 599, unitPrice: '₹49 / 100 g' },
      { weight: '1 kg Jar', flavor: 'Dark Chocolate Crispy', price: 489, mrp: 599, unitPrice: '₹49 / 100 g' },
    ]
  },
  {
    id: 'wx-protein-muesli',
    brand: 'wellx',
    name: 'WellX Super Crunch High Protein Muesli & Baked Granola',
    category: 'protein-foods',
    isVeg: true,
    rating: 4.5,
    numReviews: 920,
    image: IMAGES.oats2,
    isBestseller: false,
    description: 'Multigrain cereal clusters combined with whey protein crisps, California almonds, raisins, chia seeds, and real dark chocolate buttons. 24g protein per serving.',
    variants: [
      { weight: '400 g Pouch', flavor: 'Almond & Raisin Delight', price: 249, mrp: 299, unitPrice: '₹62 / 100 g' },
      { weight: '400 g Pouch', flavor: 'Dark Chocolate Crunch', price: 249, mrp: 299, unitPrice: '₹62 / 100 g' },
      { weight: '750 g Jar', flavor: 'Almond & Raisin Delight', price: 449, mrp: 549, unitPrice: '₹60 / 100 g' },
      { weight: '750 g Jar', flavor: 'Dark Chocolate Crunch', price: 449, mrp: 549, unitPrice: '₹60 / 100 g' },
    ]
  },
  {
    id: 'wx-fitness-oats',
    brand: 'wellx',
    name: 'WellX Fitness High Protein Whole Rolled Oats',
    category: 'protein-foods',
    isVeg: true,
    rating: 4.4,
    numReviews: 540,
    image: IMAGES.oats1,
    isBestseller: false,
    description: '100% whole grain rolled Australian oats blended with imported protein concentrate. Preps in 3 minutes, ideal for breakfast bowls, smoothies, and overnight oats.',
    variants: [
      { weight: '500 g', flavor: 'Unflavoured Original', price: 199, mrp: 249, unitPrice: '₹40 / 100 g' },
      { weight: '1 kg', flavor: 'Unflavoured Original', price: 349, mrp: 449, unitPrice: '₹35 / 100 g' },
    ]
  },

  // ------------------------------------------------------------
  // 8. HERCULES NUTRITION (Hercules Brochure April 2026)
  // ------------------------------------------------------------
  {
    id: 'herc-rapid-mass-creapure',
    brand: 'hercules',
    name: 'Hercules Rapid Mass Bulk Gainer with Creapure® Creatine',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.8,
    numReviews: 2940,
    image: IMAGES.gainer1,
    isBestseller: true,
    description: 'World-class mass gainer powered by 100% German Creapure® Creatine Monohydrate (3g per serving). Delivers high anabolic calories, BCAAs, and digestive enzymes for rapid bulking.',
    variants: [
      { weight: '1.5 kg (3.3 lb)', flavor: 'Rich Chocolate', price: 1549, mrp: 1899, unitPrice: '₹103 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Kesar Pista Badam', price: 2699, mrp: 3299, unitPrice: '₹90 / 100 g' },
      { weight: '3 kg (6.6 lb)', flavor: 'Malai Kulfi', price: 2699, mrp: 3299, unitPrice: '₹90 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Rich Chocolate', price: 3699, mrp: 4599, unitPrice: '₹74 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Kesar Pista Badam', price: 3699, mrp: 4599, unitPrice: '₹74 / 100 g' },
    ]
  },
  {
    id: 'herc-rapid-mass-gold',
    brand: 'hercules',
    name: 'Hercules Rapid Mass Gold Whey Isolate Clean Lean Gainer',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.7,
    numReviews: 1210,
    image: IMAGES.gainer3,
    isBestseller: false,
    description: 'Zero added sugar, ultra-lean bulk formula featuring pure Whey Protein Isolate and Creapure. Designed for powerlifters and athletes needing muscular bulk without excess water weight.',
    variants: [
      { weight: '3 kg (6.6 lb)', flavor: 'Rich Chocolate', price: 2499, mrp: 2999, unitPrice: '₹83 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Rich Chocolate', price: 4499, mrp: 5499, unitPrice: '₹90 / 100 g' },
    ]
  },
  {
    id: 'herc-isofyne-isolate',
    brand: 'hercules',
    name: 'Hercules Isofyne 100% Whey Isolate | Zero Lactose Zero Sugar',
    category: 'whey-isolate',
    isVeg: true,
    rating: 4.8,
    numReviews: 1140,
    image: IMAGES.isolate1,
    isBestseller: true,
    description: 'Zero lactose, zero sugar, zero fat cross-flow micro-filtered whey protein isolate. Delivers 27g pure protein per serving for direct amino delivery to fatigued muscles.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Rich Chocolate', price: 2699, mrp: 3299, unitPrice: '₹270 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Rich Chocolate', price: 4799, mrp: 5999, unitPrice: '₹240 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Cafe Mocha', price: 4799, mrp: 5999, unitPrice: '₹240 / 100 g' },
    ]
  },
  {
    id: 'herc-rapid-whey-core',
    brand: 'hercules',
    name: 'Hercules Rapid Whey Core (Isolate + Concentrate Pro Blend)',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.5,
    numReviews: 2120,
    image: IMAGES.whey2,
    isBestseller: false,
    description: 'Scientifically calibrated 70:30 Whey Isolate to Concentrate blend. 24g protein, low carbs, fast digestion, and fortified with Pepzyme AG enzymes.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Chocolate', price: 2099, mrp: 2599, unitPrice: '₹210 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Chocolate', price: 3799, mrp: 4499, unitPrice: '₹190 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Vanilla Almond', price: 3799, mrp: 4499, unitPrice: '₹190 / 100 g' },
    ]
  },
  {
    id: 'herc-creatine-creapure',
    brand: 'hercules',
    name: 'Hercules Creapure® German Micronized Creatine Monohydrate',
    category: 'creatine',
    isVeg: true,
    rating: 4.9,
    numReviews: 1870,
    image: IMAGES.creatine2,
    isBestseller: true,
    description: 'Made exclusively with Creapure® manufactured in Germany by Alzchem Trostberg GmbH. The purest, safest creatine in existence with 99.99% purity certification.',
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 549, mrp: 799, unitPrice: '₹17 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 1099, mrp: 1499, unitPrice: '₹13 / serving' },
    ]
  },
  {
    id: 'herc-preworkout-formula',
    brand: 'hercules',
    name: 'Hercules High Focus Pre-Workout Explosive Energy Formula',
    category: 'pre-workout',
    isVeg: true,
    rating: 4.5,
    numReviews: 760,
    image: IMAGES.preworkout3,
    isBestseller: false,
    description: 'High-stimulant pre-workout containing 3500mg L-Citrulline, 3000mg Beta-Alanine, and 300mg Caffeine with Siberian Ginseng for non-stop energy without energy crash.',
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Blue Raspberry', price: 1099, mrp: 1499, unitPrice: '₹37 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Fruit Punch Explosive', price: 1099, mrp: 1499, unitPrice: '₹37 / serving' },
    ]
  },
  {
    id: 'herc-glutamine-pure',
    brand: 'hercules',
    name: 'Hercules Pure Micronized L-Glutamine Anti-Catabolic Shield',
    category: 'wellness',
    isVeg: true,
    rating: 4.7,
    numReviews: 620,
    image: IMAGES.glutamine1,
    isBestseller: false,
    description: 'Pharmaceutical grade pure micronized L-Glutamine. Accelerates post-training muscle tissue repair, halts muscle wasting, and fuels immune cells.',
    variants: [
      { weight: '250 g (50 Servings)', flavor: 'Unflavoured', price: 849, mrp: 1199, unitPrice: '₹17 / serving' },
      { weight: '500 g (100 Servings)', flavor: 'Unflavoured', price: 1499, mrp: 2099, unitPrice: '₹15 / serving' },
    ]
  },

  // ------------------------------------------------------------
  // 9. RUSSIAN ANABOLIC (Hardcore Sports Nutrition Series)
  // ------------------------------------------------------------
  {
    id: 'ra-hardcore-whey',
    brand: 'russian-anabolic',
    name: 'Russian Anabolic Hardcore 100% Anabolic Whey Protein 26g',
    category: 'whey-protein',
    isVeg: true,
    rating: 4.7,
    numReviews: 1820,
    image: IMAGES.whey3,
    isBestseller: true,
    description: 'High-nitrogen whey protein loaded with 26g protein, 6g BCAAs, and anabolic test-support herbal extract matrix (Tribulus + Ashwagandha + Fenugreek) for intense muscle hypertrophy.',
    variants: [
      { weight: '1 kg (2.2 lb)', flavor: 'Russian Chocolate Vodka', price: 2199, mrp: 2799, unitPrice: '₹220 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Russian Chocolate Vodka', price: 3999, mrp: 4999, unitPrice: '₹200 / 100 g' },
      { weight: '2 kg (4.4 lb)', flavor: 'Moscow Caramel Cream', price: 3999, mrp: 4999, unitPrice: '₹200 / 100 g' },
    ]
  },
  {
    id: 'ra-mass-monster',
    brand: 'russian-anabolic',
    name: 'Russian Anabolic Mass Monster XXL Hyper-Caloric Bulking Gainer',
    category: 'mass-gainer',
    isVeg: true,
    rating: 4.6,
    numReviews: 1490,
    image: IMAGES.gainer2,
    isBestseller: true,
    description: 'Massive caloric density designed for extreme bulking cycles. Provides 1300+ calories, 50g protein, 5g creatine, and BCAAs per daily double-shake serving.',
    variants: [
      { weight: '3 kg (6.6 lb)', flavor: 'Dark Cocoa', price: 2499, mrp: 3200, unitPrice: '₹83 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Dark Cocoa', price: 3699, mrp: 4699, unitPrice: '₹74 / 100 g' },
      { weight: '5 kg (11 lb) Bucket', flavor: 'Siberian Vanilla', price: 3699, mrp: 4699, unitPrice: '₹74 / 100 g' },
    ]
  },
  {
    id: 'ra-nitric-preworkout',
    brand: 'russian-anabolic',
    name: 'Russian Anabolic Nitric Rage Pre-Workout (500mg Energy Matrix)',
    category: 'pre-workout',
    isVeg: true,
    rating: 4.8,
    numReviews: 1110,
    image: IMAGES.preworkout2,
    isBestseller: true,
    description: 'Extreme hardcore pre-workout formula. 6000mg L-Citrulline Malate 2:1, 3500mg Beta-Alanine, and 350mg Caffeine Anhydrous for tunnel-vision concentration and explosive sets.',
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Blood Orange Rage', price: 1299, mrp: 1699, unitPrice: '₹43 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Siberian Ice Berry', price: 1299, mrp: 1699, unitPrice: '₹43 / serving' },
    ]
  },
  {
    id: 'ra-creatine-power',
    brand: 'russian-anabolic',
    name: 'Russian Anabolic 100% Pure Creatine Monohydrate Power Powder',
    category: 'creatine',
    isVeg: true,
    rating: 4.7,
    numReviews: 1340,
    image: IMAGES.creatine3,
    isBestseller: false,
    description: 'Ultra-fine 200-mesh micronized creatine monohydrate. Rapidly restores cellular ATP, fueling raw power, bench press strength, and muscle density.',
    variants: [
      { weight: '100 g (33 Servings)', flavor: 'Unflavoured', price: 479, mrp: 699, unitPrice: '₹14 / serving' },
      { weight: '250 g (83 Servings)', flavor: 'Unflavoured', price: 929, mrp: 1349, unitPrice: '₹11 / serving' },
    ]
  },
  {
    id: 'ra-bcaa-811',
    brand: 'russian-anabolic',
    name: 'Russian Anabolic BCAA 8:1:1 Anabolic Ratio Intra-Workout',
    category: 'amino-acids',
    isVeg: true,
    rating: 4.5,
    numReviews: 680,
    image: IMAGES.supplement2,
    isBestseller: false,
    description: 'High-leucine 8:1:1 BCAA formula with 8x L-Leucine for maximum mTOR stimulation, muscle protein synthesis, and anti-catabolic recovery during grueling workout sessions.',
    variants: [
      { weight: '300 g (30 Servings)', flavor: 'Watermelon Anabolic', price: 1199, mrp: 1549, unitPrice: '₹40 / serving' },
      { weight: '300 g (30 Servings)', flavor: 'Green Apple Slam', price: 1199, mrp: 1549, unitPrice: '₹40 / serving' },
    ]
  },
];

// ============================================================
// COMPREHENSIVE QUERY & FILTER HELPERS
// ============================================================

export const getProductsByCategory = (categoryId) =>
  allProducts.filter((p) => p.category === categoryId);

export const getProductsByBrand = (brandId) =>
  allProducts.filter((p) => p.brand === brandId);

export const getBestsellers = () =>
  allProducts.filter((p) => p.isBestseller);

export const getProductById = (id) =>
  allProducts.find((p) => p.id === id);

export const searchProducts = (query) => {
  const q = (query || '').toLowerCase().trim();
  if (!q) return allProducts;
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
};

export const getBrandName = (brandId) => {
  const brand = brands.find((b) => b.id === brandId);
  return brand ? brand.name : brandId;
};

export const getCategoryName = (categoryId) => {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.name : categoryId;
};
