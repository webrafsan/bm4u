'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BookOpen,
  Edit,
  Globe,
  Settings,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Plus,
  RefreshCw,
  ExternalLink,
  Trash2,
  Edit3,
  Key,
  ShieldCheck,
  Send,
  Database,
  ArrowRight,
  Filter,
  DollarSign,
  Layers,
  Copy,
  Check,
  Lock,
  Unlock,
  X,
  FileText,
  Save,
  Wallet,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import { Product, OrderRecord, OrderStatus, ProductCategory, BlogPost } from '@/types';

export default function AdminDashboardPage() {
  // Authentication guard: username "webrafsan" & password "SkyBlue@113322"
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'posts' | 'content' | 'settings'>('overview');
  const [stats, setStats] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    awaitingPayment: 0,
    paymentVerified: 0,
    completedOrders: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    pingMs: 0,
    dbStatus: 'Connecting...',
  });

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    heroTitle: '',
    heroSubtitle: '',
    announcementText: '',
    telegramUsername: 'bybm4u',
    telegramLink: 'https://t.me/bybm4u',
    supportEmail: 'support@bm4u.net',
    replaceWarrantyHours: '24',
    replacePolicyTitle: 'Strict 24-Hour Technical Warranty',
    replacePolicyDesc: '',
    cryptoWallets: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Orders Filter & Search
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<OrderRecord | null>(null);
  const [deliveryInput, setDeliveryInput] = useState<string>('');
  const [isUpdatingDelivery, setIsUpdatingDelivery] = useState<boolean>(false);

  // Products Management State
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Posts / Tips Management State
  const [postSearch, setPostSearch] = useState<string>('');
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    category: 'Guides',
    readTime: '4 min read',
    date: '',
    excerpt: '',
    content: '',
  });

  // Copied alert state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    category: 'business-manager' as ProductCategory,
    price: 15,
    originalPrice: 20,
    country: 'United States',
    countryCode: 'US',
    lines: '2-line' as '2-line' | '3-line' | 'n/a',
    limit: '$250 Limit',
    format: 'UID|PASS|2FA|MAIL',
    stock: 25,
    features: '2-Line High Limit BM\nClean IP Created\nInstant Replacement Warranty',
    description: 'High limit Meta Business Manager for advertising scaling.',
    guarantee: '24 Hours Full Replacement Guarantee',
    isPopular: false,
    isSpecial: false,
  });

  // Check auth session
  useEffect(() => {
    const savedAuth = localStorage.getItem('bm4u_drafsan_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === 'webrafsan' && passwordInput === 'SkyBlue@113322') {
      setIsAuthenticated(true);
      localStorage.setItem('bm4u_drafsan_auth', 'true');
      setAuthError(null);
    } else {
      setAuthError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bm4u_drafsan_auth');
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [statsRes, ordersRes, productsRes, postsRes, settingsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/posts'),
        fetch('/api/settings'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.stats);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) setOrders(ordersData.data);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.success) setProducts(productsData.data);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        if (postsData.success) setPosts(postsData.data);
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.data) {
          setSiteSettings(settingsData.data);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Deliver Credentials to Order
  const handleSaveDeliveryCredentials = async () => {
    if (!selectedOrderForDelivery) return;
    setIsUpdatingDelivery(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrderForDelivery.orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryCredentials: deliveryInput,
          status: 'Completed',
        }),
      });
      if (res.ok) {
        setOrders(prev =>
          prev.map(o =>
            o.orderId === selectedOrderForDelivery.orderId
              ? { ...o, deliveryCredentials: deliveryInput, status: 'Completed' }
              : o
          )
        );
        setSelectedOrderForDelivery(null);
        setDeliveryInput('');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to save delivery credentials:', err);
    } finally {
      setIsUpdatingDelivery(false);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.orderId !== orderId));
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  // Quick Stock Adjust
  const handleAdjustStock = async (productId: string, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, (prod.stock || 0) + delta);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  // Save / Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      features: typeof productForm.features === 'string'
        ? productForm.features.split('\n').filter(Boolean)
        : productForm.features,
    };

    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsAddProductModalOpen(false);
          setEditingProduct(null);
          fetchData();
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsAddProductModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Save / Update Blog Post
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...postForm,
      content: typeof postForm.content === 'string'
        ? postForm.content.split('\n\n').filter(Boolean)
        : postForm.content,
    };

    try {
      if (editingPost) {
        const res = await fetch(`/api/posts/${editingPost.slug}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsAddPostModalOpen(false);
          setEditingPost(null);
          fetchData();
        }
      } else {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setIsAddPostModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  // Delete Blog Post
  const handleDeletePost = async (slug: string, title: string) => {
    if (!confirm(`Delete guide "${title}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.slug !== slug));
        fetchData();
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  // Save Site Content & Settings
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccessMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteSettings),
      });
      if (res.ok) {
        setSaveSuccessMsg('Page content & settings saved to MongoDB successfully!');
        setTimeout(() => setSaveSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Trigger Database Seed
  const handleSeedDatabase = async (force: boolean = false) => {
    if (!confirm(force ? 'Force overwrite all products with default catalog?' : 'Sync products with default catalog?')) return;
    try {
      const res = await fetch(`/api/seed${force ? '?force=true' : ''}`, { method: 'POST' });
      const data = await res.json();
      alert(data.message || 'Catalog synced!');
      fetchData();
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const inId = o.orderId.toLowerCase().includes(q);
        const inEmail = o.customer.email.toLowerCase().includes(q);
        const inTg = o.customer.telegram.toLowerCase().includes(q);
        const inTx = o.txid?.toLowerCase().includes(q) || false;
        if (!inId && !inEmail && !inTg && !inTx) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCatFilter !== 'all' && p.category !== productCatFilter) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inCountry = p.country?.toLowerCase().includes(q) || false;
        const inLimit = p.limit?.toLowerCase().includes(q) || false;
        if (!inTitle && !inCountry && !inLimit) return false;
      }
      return true;
    });
  }, [products, productCatFilter, productSearch]);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      if (postSearch.trim()) {
        const q = postSearch.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      }
      return true;
    });
  }, [posts, postSearch]);

  // If not authenticated, show secure login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#EDF0F2] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#CBD5E1] shadow-xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-[#FFFBEB] border border-[#FBAD18]/40 flex items-center justify-center text-[#D97706] mb-3 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-heading text-2xl font-black text-[#0F172A] tracking-tight">
              BM4U Secure Command
            </h1>
            <p className="text-xs text-[#64748B] mt-1 font-medium">
              Authorized administrator access only
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="Enter username"
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FBAD18] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#475569] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FBAD18] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
            <Link href="/" className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] inline-flex items-center gap-1.5 transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#0F172A] flex flex-col font-sans">
      
      {/* TOP ADMIN HEADER */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FBAD18] to-[#E69D0E] flex items-center justify-center text-[#0F172A] font-black font-heading text-lg shadow-sm">
                B
              </div>
              <div>
                <div className="font-heading font-extrabold text-sm sm:text-base leading-none text-[#0F172A]">
                  BM4U <span className="text-[#D97706] text-xs font-bold uppercase tracking-wider ml-1">Admin Portal</span>
                </div>
                <div className="text-[10px] text-[#64748B] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MongoDB Atlas Connected</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-bold text-[#475569] flex items-center gap-1.5 transition-all shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#FBAD18]' : ''}`} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-xs font-bold text-[#475569] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all"
              title="Sign Out"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1.5">Lock</span>
            </button>
          </div>

        </div>

        {/* NAVIGATION TABS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 border-t border-[#F1F5F9] overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Stats', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package, badge: stats.awaitingPayment > 0 ? stats.awaitingPayment : null },
            { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
            { id: 'posts', label: `Tips & Blog (${posts.length})`, icon: BookOpen },
            { id: 'content', label: 'Page Content CMS', icon: Globe },
            { id: 'settings', label: 'Database & Sync', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#FBAD18] text-[#D97706]'
                    : 'border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-[#94A3B8]'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN ADMIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:px-8 space-y-8">
        
        {/* ===================== TAB 1: OVERVIEW ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Total Revenue</span>
                  <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1 font-medium">
                  From {stats.totalOrders} total recorded orders
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">All Orders</span>
                  <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {stats.totalOrders}
                </div>
                <div className="text-[11px] text-blue-600 font-semibold mt-1">
                  {stats.completedOrders} completed & fulfilled
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Awaiting Verification</span>
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#D97706]">
                  {stats.awaitingPayment + stats.paymentVerified}
                </div>
                <div className="text-[11px] text-[#64748B] mt-1 font-medium">
                  {stats.paymentVerified} with TXID submitted
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Live Catalog</span>
                  <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  {stats.totalProducts}
                </div>
                <div className="text-[11px] text-purple-600 font-medium mt-1">
                  {stats.lowStockProducts} low stock alerts
                </div>
              </div>

            </div>

            {/* RECENT ORDERS */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-extrabold text-[#0F172A]">Recent Orders</h3>
                  <p className="text-xs text-[#64748B]">Real-time customer transactions stored in MongoDB</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center text-[#64748B]">
                  <Package className="w-10 h-10 mx-auto text-[#CBD5E1] mb-2" />
                  <p className="text-sm font-semibold">No orders recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold tracking-wider border-b border-[#E2E8F0]">
                        <th className="p-3.5 pl-5">Order ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Payment / TXID</th>
                        <th className="p-3.5">Total</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right pr-5">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.orderId} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="p-3.5 pl-5 font-mono font-bold text-[#0F172A]">{o.orderId}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#0F172A]">{o.customer.fullName || 'Guest'}</div>
                            <div className="text-[11px] text-[#64748B]">{o.customer.email}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-[#0F172A]">{o.customer.selectedCrypto || 'Crypto'}</span>
                            {o.txid && <div className="font-mono text-[10px] text-[#059669]">TX: {o.txid.slice(0, 16)}...</div>}
                          </td>
                          <td className="p-3.5 font-bold text-[#0F172A]">${o.total.toFixed(2)}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-extrabold ${
                              o.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-5">
                            <button
                              onClick={() => {
                                setSelectedOrderForDelivery(o);
                                setDeliveryInput(o.deliveryCredentials || '');
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] font-bold rounded-lg border border-[#FBAD18]/40 text-[11px]"
                            >
                              Fulfill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ORDERS MANAGEMENT ===================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-[#0F172A]">Order Management</h2>
                <p className="text-xs text-[#64748B]">Verify crypto payments, deliver assets, and manage customer orders.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={e => setOrderSearch(e.target.value)}
                    placeholder="Search ID, email, TG, TXID..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FBAD18]"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FBAD18]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Awaiting Payment">Awaiting Payment</option>
                  <option value="Payment Verified">Payment Verified</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-[#64748B]">
                  <Package className="w-12 h-12 mx-auto text-[#CBD5E1] mb-3" />
                  <p className="text-sm font-semibold text-[#0F172A]">No matching orders found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold tracking-wider border-b border-[#E2E8F0]">
                        <th className="p-3.5 pl-5">Order ID & Date</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Crypto & TXID</th>
                        <th className="p-3.5">Purchased Items</th>
                        <th className="p-3.5">Total</th>
                        <th className="p-3.5">Status Update</th>
                        <th className="p-3.5 text-right pr-5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {filteredOrders.map(o => (
                        <tr key={o.orderId} className="hover:bg-[#F8FAFC]/80 transition-colors">
                          <td className="p-3.5 pl-5">
                            <div className="font-mono font-bold text-sm text-[#0F172A]">{o.orderId}</div>
                            <div className="text-[10px] text-[#94A3B8]">{new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#0F172A]">{o.customer.fullName || 'Guest'}</div>
                            <div className="text-[11px] text-[#64748B] font-mono">{o.customer.email}</div>
                            <div className="text-[11px] text-[#0284C7] font-semibold mt-0.5">@{o.customer.telegram.replace('@', '')}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-[#0F172A]">{o.customer.selectedCrypto || 'USDT'}</div>
                            {o.txid ? (
                              <div className="flex items-center gap-1 mt-1">
                                <span className="font-mono text-[10px] text-[#059669] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 truncate max-w-[130px]">
                                  {o.txid}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block mt-1">
                                Pending TXID
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 max-w-[200px]">
                            {o.items?.map((it, idx) => (
                              <div key={idx} className="text-[11px] font-medium text-[#334155] truncate">
                                {it.quantity}x {it.product.title}
                              </div>
                            ))}
                          </td>
                          <td className="p-3.5 font-bold text-sm text-[#0F172A]">${o.total.toFixed(2)}</td>
                          <td className="p-3.5">
                            <select
                              value={o.status}
                              onChange={e => handleUpdateOrderStatus(o.orderId, e.target.value as OrderStatus)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold border bg-white focus:outline-none"
                            >
                              <option value="Awaiting Payment">Awaiting Payment</option>
                              <option value="Payment Verified">Payment Verified</option>
                              <option value="Processing">Processing</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3.5 text-right pr-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedOrderForDelivery(o);
                                  setDeliveryInput(o.deliveryCredentials || '');
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] font-bold border border-[#FBAD18]/40 transition-colors text-[11px] flex items-center gap-1"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>Fulfill</span>
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(o.orderId)}
                                className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Fulfill Modal */}
            {selectedOrderForDelivery && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#CBD5E1] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <h3 className="font-heading text-base font-extrabold text-[#0F172A]">
                      Fulfill Order: {selectedOrderForDelivery.orderId}
                    </h3>
                    <button onClick={() => setSelectedOrderForDelivery(null)}>
                      <X className="w-5 h-5 text-[#94A3B8]" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">
                      Account / BM Access Credentials to Deliver
                    </label>
                    <textarea
                      rows={5}
                      value={deliveryInput}
                      onChange={e => setDeliveryInput(e.target.value)}
                      placeholder="BM Invite link, UID|PASS|2FA, or access credentials..."
                      className="w-full p-3 font-mono text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FBAD18]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForDelivery(null)}
                      className="px-4 py-2 border border-[#CBD5E1] text-[#475569] text-xs font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isUpdatingDelivery}
                      onClick={handleSaveDeliveryCredentials}
                      className="px-5 py-2 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] text-xs font-bold rounded-xl shadow"
                    >
                      {isUpdatingDelivery ? 'Saving...' : 'Save & Deliver to Customer'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: PRODUCTS MANAGER ===================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-[#0F172A]">Product Catalog Manager</h2>
                <p className="text-xs text-[#64748B]">Manage prices, stock, and descriptions dynamically stored in MongoDB.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="Search product title..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FBAD18]"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({
                      title: '',
                      category: 'business-manager',
                      price: 15,
                      originalPrice: 20,
                      country: 'Global',
                      countryCode: 'UN',
                      lines: '2-line',
                      limit: '$250 Limit',
                      format: 'UID|PASS|2FA|MAIL',
                      stock: 25,
                      features: 'Instant Admin Invite Link\n24h Replacement Guarantee\nPixel Shareable',
                      description: 'Premium advertising asset.',
                      guarantee: '24 Hours Full Replacement Guarantee',
                      isPopular: false,
                      isSpecial: false,
                    });
                    setIsAddProductModalOpen(true);
                  }}
                  className="py-2 px-3.5 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-[#64748B] uppercase font-bold tracking-wider border-b border-[#E2E8F0]">
                      <th className="p-3.5 pl-5">Product Details</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Format & Limit</th>
                      <th className="p-3.5 text-right pr-5">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                        <td className="p-3.5 pl-5 max-w-xs">
                          <div className="font-bold text-sm text-[#0F172A] line-clamp-1">{p.title}</div>
                          <div className="text-[11px] text-[#64748B]">ID: {p.id} • {p.country || 'Global'}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F1F5F9] text-[#475569] uppercase border border-[#CBD5E1]">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-3.5 font-extrabold text-sm text-[#0F172A]">${p.price}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdjustStock(p.id, -1)}
                              className="w-6 h-6 rounded bg-[#F1F5F9] font-bold text-[#475569] flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-bold font-mono px-2">{p.stock}</span>
                            <button
                              onClick={() => handleAdjustStock(p.id, 1)}
                              className="w-6 h-6 rounded bg-[#F1F5F9] font-bold text-[#475569] flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-[#334155]">{p.limit || 'No Limit'}</div>
                          <div className="text-[10px] text-[#64748B] font-mono truncate max-w-[140px]">{p.format}</div>
                        </td>
                        <td className="p-3.5 text-right pr-5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm({
                                  title: p.title,
                                  category: p.category,
                                  price: p.price,
                                  originalPrice: p.originalPrice || 0,
                                  country: p.country || 'Global',
                                  countryCode: p.countryCode || 'UN',
                                  lines: (p.lines as any) || 'n/a',
                                  limit: p.limit || '',
                                  format: p.format || '',
                                  stock: p.stock,
                                  features: Array.isArray(p.features) ? p.features.join('\n') : '',
                                  description: p.description || '',
                                  guarantee: p.guarantee || '',
                                  isPopular: Boolean(p.isPopular),
                                  isSpecial: Boolean(p.isSpecial),
                                });
                                setIsAddProductModalOpen(true);
                              }}
                              className="p-1.5 text-[#64748B] hover:text-[#0F172A]"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.title)}
                              className="p-1.5 text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Modal */}
            {isAddProductModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#CBD5E1] my-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <h3 className="font-heading text-lg font-extrabold text-[#0F172A]">
                      {editingProduct ? 'Edit Catalog Product' : 'Add New Product to MongoDB'}
                    </h3>
                    <button onClick={() => setIsAddProductModalOpen(false)}>
                      <X className="w-5 h-5 text-[#94A3B8]" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Product Title</label>
                      <input
                        type="text"
                        required
                        value={productForm.title}
                        onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:ring-2 focus:ring-[#FBAD18] focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Category</label>
                        <select
                          value={productForm.category}
                          onChange={e => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:ring-2 focus:ring-[#FBAD18] focus:outline-none"
                        >
                          <option value="business-manager">Business Manager</option>
                          <option value="verified-bm">Verified BM</option>
                          <option value="facebook-account">Facebook Account</option>
                          <option value="tiktok-account">TikTok Account</option>
                          <option value="special-item">Special Item</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Price ($ USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={productForm.price}
                          onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:ring-2 focus:ring-[#FBAD18] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Stock Quantity</label>
                        <input
                          type="number"
                          value={productForm.stock}
                          onChange={e => setProductForm({ ...productForm, stock: parseInt(e.target.value, 10) || 0 })}
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Daily Limit</label>
                        <input
                          type="text"
                          value={productForm.limit}
                          onChange={e => setProductForm({ ...productForm, limit: e.target.value })}
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Delivery Format</label>
                      <input
                        type="text"
                        value={productForm.format}
                        onChange={e => setProductForm({ ...productForm, format: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Features (one per line)</label>
                      <textarea
                        rows={3}
                        value={productForm.features}
                        onChange={e => setProductForm({ ...productForm, features: e.target.value })}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={() => setIsAddProductModalOpen(false)}
                        className="px-4 py-2 border border-[#CBD5E1] text-[#475569] font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] font-bold rounded-xl shadow"
                      >
                        {editingProduct ? 'Save Changes' : 'Create Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: TIPS & BLOG CMS ===================== */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-extrabold text-[#0F172A]">Tips & Blog Articles Manager</h2>
                <p className="text-xs text-[#64748B]">Publish guides, account setup tips, and tutorials dynamically to MongoDB.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={postSearch}
                    onChange={e => setPostSearch(e.target.value)}
                    placeholder="Search guide title..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FBAD18]"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingPost(null);
                    setPostForm({
                      title: '',
                      slug: '',
                      category: 'Guides',
                      readTime: '4 min read',
                      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                      excerpt: '',
                      content: '',
                    });
                    setIsAddPostModalOpen(true);
                  }}
                  className="py-2 px-3.5 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Guide / Tip</span>
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPosts.map(p => (
                <div key={p.slug} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">
                        {p.category}
                      </span>
                      <span>{p.readTime}</span>
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-[#0F172A] mb-2 line-clamp-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-3 mb-4">
                      {p.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[11px] text-[#94A3B8]">{p.date}</span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/tips/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded hover:bg-[#F1F5F9]"
                        title="View on site"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => {
                          setEditingPost(p);
                          setPostForm({
                            title: p.title,
                            slug: p.slug,
                            category: p.category,
                            readTime: p.readTime,
                            date: p.date,
                            excerpt: p.excerpt,
                            content: Array.isArray(p.content) ? p.content.join('\n\n') : (p.content || ''),
                          });
                          setIsAddPostModalOpen(true);
                        }}
                        className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded hover:bg-[#F1F5F9]"
                        title="Edit Guide"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(p.slug, p.title)}
                        className="p-1.5 text-red-400 hover:text-red-600 rounded hover:bg-red-50"
                        title="Delete Guide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Modal */}
            {isAddPostModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#CBD5E1] my-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                    <h3 className="font-heading text-lg font-extrabold text-[#0F172A]">
                      {editingPost ? 'Edit Guide / Tip Article' : 'Create New Guide in MongoDB'}
                    </h3>
                    <button onClick={() => setIsAddPostModalOpen(false)}>
                      <X className="w-5 h-5 text-[#94A3B8]" />
                    </button>
                  </div>
                  <form onSubmit={handleSavePost} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                        placeholder="e.g. How to Add Backup Admin into Facebook Business Manager"
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium focus:ring-2 focus:ring-[#FBAD18]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Category</label>
                        <input
                          type="text"
                          value={postForm.category}
                          onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                          placeholder="e.g. Guides, Security, Architecture"
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-[#475569] mb-1">Read Time</label>
                        <input
                          type="text"
                          value={postForm.readTime}
                          onChange={e => setPostForm({ ...postForm, readTime: e.target.value })}
                          placeholder="e.g. 5 min read"
                          className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">Short Excerpt / Summary</label>
                      <textarea
                        rows={2}
                        value={postForm.excerpt}
                        onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })}
                        placeholder="A brief summary shown on the tips list card..."
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#475569] mb-1">
                        Article Content (Separate paragraphs with blank lines)
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={postForm.content}
                        onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                        placeholder="Write your article paragraphs here. Markdown headings (###) and bullet lists are supported."
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                      <button
                        type="button"
                        onClick={() => setIsAddPostModalOpen(false)}
                        className="px-4 py-2 border border-[#CBD5E1] text-[#475569] font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] font-bold rounded-xl shadow"
                      >
                        {editingPost ? 'Save Article' : 'Publish Article'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 5: PAGE CONTENT & SITE CMS ===================== */}
        {activeTab === 'content' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-[#0F172A]">Page Content & Site CMS</h2>
              <p className="text-xs text-[#64748B]">Update homepage text, announcements, Telegram support channels, and crypto wallet addresses.</p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSiteSettings} className="space-y-6">
              
              {/* HOMEPAGE HERO SETTINGS */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                  <Globe className="w-4 h-4 text-[#D97706]" />
                  <h3 className="font-heading text-sm font-extrabold text-[#0F172A]">Homepage Hero & Announcements</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={siteSettings.heroTitle || ''}
                    onChange={e => setSiteSettings({ ...siteSettings, heroTitle: e.target.value })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#FBAD18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">Hero Subtitle Paragraph</label>
                  <textarea
                    rows={3}
                    value={siteSettings.heroSubtitle || ''}
                    onChange={e => setSiteSettings({ ...siteSettings, heroSubtitle: e.target.value })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#FBAD18]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">Top Announcement Badge Text</label>
                  <input
                    type="text"
                    value={siteSettings.announcementText || ''}
                    onChange={e => setSiteSettings({ ...siteSettings, announcementText: e.target.value })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#FBAD18]"
                  />
                </div>
              </div>

              {/* TELEGRAM & SUPPORT CONTACT */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                  <Send className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="font-heading text-sm font-extrabold text-[#0F172A]">Support & Telegram Channels</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">Telegram Support Username</label>
                    <input
                      type="text"
                      value={siteSettings.telegramUsername || ''}
                      onChange={e => setSiteSettings({ ...siteSettings, telegramUsername: e.target.value })}
                      placeholder="e.g. bybm4u"
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">Telegram Direct Link URL</label>
                    <input
                      type="text"
                      value={siteSettings.telegramLink || ''}
                      onChange={e => setSiteSettings({ ...siteSettings, telegramLink: e.target.value })}
                      placeholder="https://t.me/bybm4u"
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">Support Email</label>
                  <input
                    type="email"
                    value={siteSettings.supportEmail || ''}
                    onChange={e => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                    placeholder="support@bm4u.net"
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* REPLACEMENT RULES & POLICY */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-heading text-sm font-extrabold text-[#0F172A]">Replacement Guarantee Policy</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">Warranty Duration (Hours)</label>
                    <input
                      type="text"
                      value={siteSettings.replaceWarrantyHours || '24'}
                      onChange={e => setSiteSettings({ ...siteSettings, replaceWarrantyHours: e.target.value })}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#475569] mb-1">Policy Card Heading</label>
                    <input
                      type="text"
                      value={siteSettings.replacePolicyTitle || ''}
                      onChange={e => setSiteSettings({ ...siteSettings, replacePolicyTitle: e.target.value })}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#475569] mb-1">Policy Description</label>
                  <textarea
                    rows={3}
                    value={siteSettings.replacePolicyDesc || ''}
                    onChange={e => setSiteSettings({ ...siteSettings, replacePolicyDesc: e.target.value })}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              {/* CRYPTO WALLETS MANAGER */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                  <Wallet className="w-4 h-4 text-amber-600" />
                  <h3 className="font-heading text-sm font-extrabold text-[#0F172A]">Crypto Payment Wallets</h3>
                </div>

                <div className="space-y-4">
                  {siteSettings.cryptoWallets?.map((wallet: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F172A]">{wallet.name} ({wallet.symbol})</span>
                        <span className="text-[#64748B] font-mono text-[11px]">{wallet.network}</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#64748B] mb-0.5">Deposit Address</label>
                        <input
                          type="text"
                          value={wallet.address}
                          onChange={e => {
                            const newWallets = [...siteSettings.cryptoWallets];
                            newWallets[index].address = e.target.value;
                            setSiteSettings({ ...siteSettings, cryptoWallets: newWallets });
                          }}
                          className="w-full p-2 bg-white border border-[#CBD5E1] rounded-lg font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-3 bg-gradient-to-r from-[#FBAD18] to-[#E69D0E] text-[#0F172A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Saving to Database...' : 'Save All Page Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ===================== TAB 6: SETTINGS & SYNC ===================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="font-heading text-xl font-extrabold text-[#0F172A]">Database & System Tools</h2>
              <p className="text-xs text-[#64748B]">Manage MongoDB Atlas integration, seed data, and operational health.</p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-[#F1F5F9]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="font-heading text-base font-bold text-[#0F172A]">MongoDB Atlas Cluster</h3>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">bm4u.vfhwhh0.mongodb.net (Database: bm4u)</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live ({stats.pingMs}ms latency)
                  </span>
                </div>
              </div>

              <div className="space-y-3 pb-6 border-b border-[#F1F5F9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Catalog Sync & Seeder</h4>
                <p className="text-xs text-[#64748B]">
                  Easily sync or re-populate all default products directly into your MongoDB Atlas collection.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => handleSeedDatabase(false)}
                    className="px-4 py-2 bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#D97706] font-bold text-xs rounded-xl border border-[#FBAD18]/40 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Initial Catalog</span>
                  </button>
                  <button
                    onClick={() => handleSeedDatabase(true)}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Force Re-seed Catalog (Reset)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#475569]">Admin Access Credentials</h4>
                <p className="text-xs text-[#64748B]">
                  Admin URL: <span className="font-mono font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded">/drafsan</span> • Username: <span className="font-mono font-bold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded">webrafsan</span>
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
