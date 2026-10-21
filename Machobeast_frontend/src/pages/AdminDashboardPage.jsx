import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  Check,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Boxes,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  Flame,
  Zap,
  GripHorizontal
} from 'lucide-react';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  resetToDefaultCatalog,
  addCategory,
  addBrand
} from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';

const SAMPLE_IMAGES = [
  { name: 'Whey Protein', url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600' },
  { name: 'Creatine Monohydrate', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600' },
  { name: 'Peanut Butter', url: 'https://images.unsplash.com/photo-1612187209234-a73a1210e68c?w=600' },
  { name: 'Mass Gainer', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600' },
  { name: 'Pre-Workout Rush', url: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=600' },
  { name: 'Fish Oil Omega-3', url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600' },
];

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { items: products, brands, categories } = useSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: brands[0]?.id || 'divine-nutrition',
    category: categories[0]?.id || 'whey-protein',
    price: '',
    mrp: '',
    image: SAMPLE_IMAGES[0].url,
    description: '',
    isVeg: true,
    isBestseller: false,
    stockQuantity: 50,
    weight: '1 kg (2.2 lb)',
    flavor: 'Chocolate Fudge',
  });

  const [isDragImageActive, setIsDragImageActive] = useState(false);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      brand: brands[0]?.id || 'divine-nutrition',
      category: categories[0]?.id || 'whey-protein',
      price: '',
      mrp: '',
      image: SAMPLE_IMAGES[0].url,
      description: '',
      isVeg: true,
      isBestseller: false,
      stockQuantity: 50,
      weight: '1 kg (2.2 lb)',
      flavor: 'Chocolate Fudge',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingId(p.id);
    const variant = p.variants?.[0] || {};
    setFormData({
      name: p.name || '',
      brand: p.brand || brands[0]?.id,
      category: p.category || categories[0]?.id,
      price: variant.price || p.price || '',
      mrp: variant.mrp || p.mrp || '',
      image: p.image || SAMPLE_IMAGES[0].url,
      description: p.description || '',
      isVeg: p.isVeg !== false,
      isBestseller: !!p.isBestseller,
      stockQuantity: p.stockQuantity || 50,
      weight: variant.weight || '1 kg (2.2 lb)',
      flavor: variant.flavor || 'Rich Chocolate',
    });
    setIsModalOpen(true);
  };

  // Image Drag & Drop File Handlers
  const handleImageFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragImageActive(false);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  // File Input Change (Click to browse file)
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const processImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({ ...prev, image: uploadEvent.target.result }));
        showToast('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    } else {
      showToast('Please select a valid image file (PNG/JPG/WEBP)', 'error');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price || !formData.mrp) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const priceNum = Number(formData.price);
    const mrpNum = Number(formData.mrp);

    const productPayload = {
      id: editingId || `macho-prod-${Date.now()}`,
      name: formData.name.trim(),
      brand: formData.brand,
      category: formData.category,
      price: priceNum,
      mrp: mrpNum,
      image: formData.image || SAMPLE_IMAGES[0].url,
      description: formData.description.trim() || `${formData.name} - Maximum grade premium nutrition formulation by MachoBeast.`,
      isVeg: formData.isVeg,
      isBestseller: formData.isBestseller,
      stockQuantity: Number(formData.stockQuantity) || 50,
      rating: 4.9,
      numReviews: Math.floor(Math.random() * 800) + 120,
      variants: [
        {
          weight: formData.weight,
          flavor: formData.flavor,
          price: priceNum,
          mrp: mrpNum,
          unitPrice: `₹${Math.round(priceNum / 10)} / 100 g`
        }
      ]
    };

    if (editingId) {
      dispatch(updateProduct(productPayload));
      showToast(`Product "${formData.name}" updated successfully!`);
    } else {
      dispatch(addProduct(productPayload));
      showToast(`Product "${formData.name}" published to MachoBeast Storefront!`);
    }

    setIsModalOpen(false);
  };

  // Quick 1-Click Demo Product Addition
  const handleAddQuickDemoProduct = () => {
    const demoItems = [
      {
        name: 'MachoBeast Nitro Ultra Hydrolyzed Whey Isolate (Gold Series)',
        brand: 'divine-nutrition',
        category: 'whey-isolate',
        price: 2899,
        mrp: 3999,
        image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600',
        weight: '2 kg (4.4 lb)',
        flavor: 'Double Rich Belgian Chocolate',
        isBestseller: true,
        isVeg: true
      },
      {
        name: 'Maxures Creapure® German Micronized Creatine 300g',
        brand: 'maxures',
        category: 'creatine',
        price: 1199,
        mrp: 1699,
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600',
        weight: '300 g (100 Servings)',
        flavor: 'Unflavoured Pure',
        isBestseller: false,
        isVeg: true
      },
      {
        name: 'Alpino Dark Chocolate High Protein Peanut Butter Crispy',
        brand: 'alpino',
        category: 'peanut-butter',
        price: 499,
        mrp: 699,
        image: 'https://images.unsplash.com/photo-1612187209234-a73a1210e68c?w=600',
        weight: '1 kg Jar',
        flavor: 'Dark Chocolate Crunchy',
        isBestseller: true,
        isVeg: true
      }
    ];

    const pick = demoItems[Math.floor(Math.random() * demoItems.length)];
    const productPayload = {
      id: `macho-new-${Date.now()}`,
      ...pick,
      description: 'Newly launched athlete formula. Clinically dosed for pure muscle hypertrophy and instantaneous glycogen refuel.',
      stockQuantity: 100,
      rating: 5.0,
      numReviews: 450,
      variants: [
        {
          weight: pick.weight,
          flavor: pick.flavor,
          price: pick.price,
          mrp: pick.mrp,
          unitPrice: `₹${Math.round(pick.price / 10)} / 100 g`
        }
      ]
    };

    dispatch(addProduct(productPayload));
    showToast(`⚡ Demo Product "${pick.name}" added instantly!`);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || p.category === filterCategory;
    const matchesBrand = filterBrand === 'all' || p.brand === filterBrand;
    return matchesSearch && matchesCat && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 select-none">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`fixed top-20 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2 animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-800'
              : 'bg-emerald-950 text-emerald-200 border-emerald-500'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
          )}
          <span className="text-xs font-bold">{notification.msg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* MachoBeast Seller Central Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#febd69] text-slate-950 font-black text-xs px-2.5 py-0.5 rounded uppercase tracking-wider">
                MachoBeast Seller Central
              </span>
              <span className="text-xs text-amber-200 font-medium">
                Live Inventory Manager
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Product & Catalog Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Future items ko dynamically add karein, images drag & drop se upload karein, aur products ko drag-to-cart karke test karein!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddQuickDemoProduct}
              className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              title="Add a pre-filled demo supplement with 1 click"
            >
              <Zap className="w-4 h-4 fill-amber-300" />
              1-Click Demo Item
            </button>

            <button
              onClick={handleOpenAddModal}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add New Product
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset catalog back to initial default items?')) {
                  dispatch(resetToDefaultCatalog());
                  showToast('Catalog restored to factory default');
                }
              }}
              className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset products to initial seed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Catalog
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Total Products</p>
              <p className="text-xl font-black text-gray-900">{products.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Categories</p>
              <p className="text-xl font-black text-gray-900">{categories.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Active Brands</p>
              <p className="text-xl font-black text-gray-900">{brands.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">Bestsellers</p>
              <p className="text-xl font-black text-gray-900">
                {products.filter((p) => p.isBestseller).length}
              </p>
            </div>
          </div>
        </div>

        {/* Drag & Drop Testing Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <GripHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                MachoBeast Drag & Drop Ready System
              </h4>
              <p className="text-xs text-amber-800">
                Kisi bhi product card ko mouse se drag karke screen ke floating Cart ya Navbar cart par drop karein!
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Visit Live Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or brand..."
              className="w-full bg-gray-50 text-xs text-gray-900 rounded-lg pl-9 pr-3 py-2.5 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs font-semibold rounded-lg px-3 py-2 text-gray-700 focus:ring-amber-500"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-xs font-semibold rounded-lg px-3 py-2 text-gray-700 focus:ring-amber-500"
            >
              <option value="all">All Brands ({brands.length})</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <h3 className="text-sm font-bold text-gray-900">
              Active Inventory ({filteredProducts.length} items)
            </h3>
            <span className="text-xs text-gray-500">
              Drag any card below to test drag-to-cart!
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Selling Price</th>
                  <th className="px-4 py-3">MRP</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Badges</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-400">
                      No products found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const variant = p.variants?.[0] || {};
                    const price = variant.price || p.price || 0;
                    const mrp = variant.mrp || p.mrp || 0;
                    const isCustom = p.id.startsWith('macho-') || p.id.startsWith('custom-');

                    return (
                      <tr
                        key={p.id}
                        draggable="true"
                        onDragStart={(e) => {
                          window.__MACHOBEAST_DRAGGED_ITEM__ = p;
                          try {
                            e.dataTransfer.setData('application/json', JSON.stringify(p));
                            e.dataTransfer.setData('text/plain', JSON.stringify(p));
                          } catch (err) {}
                          dispatch(addProduct.setDraggingProduct?.(p) || { type: 'products/setDraggingProduct', payload: p });
                        }}
                        onDragEnd={() => {
                          dispatch({ type: 'products/clearDraggingProduct' });
                        }}
                        className="hover:bg-amber-50/40 transition-colors cursor-grab active:cursor-grabbing"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              draggable="false"
                              className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 border border-gray-100 shrink-0 pointer-events-none"
                            />
                            <div className="max-w-xs">
                              <Link
                                to={`/product/${p.id}`}
                                className="font-bold text-gray-900 hover:text-amber-600 line-clamp-1 flex items-center gap-1"
                              >
                                {p.name}
                                <ExternalLink className="w-3 h-3 text-gray-400 inline" />
                              </Link>
                              <span className="text-[10px] text-gray-500">
                                {variant.weight || 'Standard'} • {variant.flavor || 'Regular'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-700 capitalize">
                          {p.brand}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-600">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-black text-gray-900">
                          ₹{price.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-gray-400 line-through">
                          ₹{mrp.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                            In Stock ({p.stockQuantity || 50})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {p.isBestseller && (
                              <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                                Bestseller
                              </span>
                            )}
                            {isCustom && (
                              <span className="bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">
                                Dynamic
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors text-gray-600 cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${p.name}"?`)) {
                                  dispatch(deleteProduct(p.id));
                                  showToast(`Deleted ${p.name}`);
                                }
                              }}
                              className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors text-gray-600 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {editingId ? 'Edit Product Details' : 'Add New Future Product to MachoBeast'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Item instant storefront me save ho jayega aur search / shop / home pe dikhega!
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Form Controls - Left 2 Columns */}
              <form onSubmit={handleFormSubmit} className="lg:col-span-2 space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Divine Nutrition 100% Whey Gold Protein Powder"
                    className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Brand *
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 1999"
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      MRP (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                      placeholder="e.g. 2999"
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      placeholder="50"
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Variant: Weight & Flavor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Default Weight / Serving
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 1 kg (2.2 lb)"
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Default Flavor
                    </label>
                    <input
                      type="text"
                      value={formData.flavor}
                      onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                      placeholder="e.g. Belgian Chocolate"
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Interactive Drag and Drop Image Box + File Browser */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Product Image (Drag & Drop File, Click to Browse, or Paste URL)
                  </label>
                  
                  {/* Hidden File Input for Click to Browse */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragImageActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDragImageActive(false);
                    }}
                    onDrop={handleImageFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                      isDragImageActive
                        ? 'border-amber-500 bg-amber-100 scale-102 ring-4 ring-amber-300'
                        : 'border-gray-300 hover:border-amber-500 bg-gray-50 hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-800">
                        📁 Drag and drop image file here, or <span className="text-amber-600 underline">Click to Browse</span>
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Supports PNG, JPG, JPEG, WEBP from your computer
                      </p>
                    </div>
                  </div>

                  {/* Direct URL input */}
                  <div className="mt-2">
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Or enter Image URL: https://..."
                      className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Preset quick image selection */}
                  <div className="mt-2 flex items-center gap-1.5 overflow-x-auto py-1">
                    <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">Presets:</span>
                    {SAMPLE_IMAGES.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: img.url })}
                        className="text-[10px] bg-gray-100 hover:bg-amber-100 text-gray-700 px-2 py-0.5 rounded whitespace-nowrap border border-gray-200 cursor-pointer"
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Description & Supplement Facts
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe product highlights, purity certificate, and benefits..."
                    className="w-full bg-gray-50 border border-gray-300 text-xs font-medium text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isVeg}
                      onChange={(e) => setFormData({ ...formData, isVeg: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <span>100% Vegetarian (Veg Mark)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.isBestseller}
                      onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <span>Mark as #1 Bestseller</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-black bg-[#ffd814] hover:bg-[#f7ca00] text-slate-900 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    {editingId ? 'Save Changes' : 'Publish Product to Store'}
                  </button>
                </div>
              </form>

              {/* Right Side - Interactive Live Product Card Preview */}
              <div className="lg:border-l lg:border-gray-200 lg:pl-6 flex flex-col items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Live MachoBeast Card Preview
                </span>
                <div className="w-full max-w-[260px]">
                  <ProductCard
                    product={{
                      id: 'preview',
                      name: formData.name || 'Sample Product Name Here',
                      brand: formData.brand,
                      category: formData.category,
                      price: Number(formData.price) || 1499,
                      mrp: Number(formData.mrp) || 1999,
                      image: formData.image || SAMPLE_IMAGES[0].url,
                      isVeg: formData.isVeg,
                      isBestseller: formData.isBestseller,
                      variants: [
                        {
                          weight: formData.weight,
                          flavor: formData.flavor,
                          price: Number(formData.price) || 1499,
                          mrp: Number(formData.mrp) || 1999,
                          unitPrice: `₹${Math.round((Number(formData.price) || 1499) / 10)} / 100 g`
                        }
                      ]
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
                  Ye live preview hai. Aap is card ko bhi drag karke cart me drop test kar sakte hain!
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
