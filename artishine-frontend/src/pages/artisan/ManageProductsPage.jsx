// src/pages/artisan/ManageProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import CanvasBackground from '../../components/CanvasBackground';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import ProductServices from '../../services/ProductServices';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // NEW: selected product for modal / detail view
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();

  // ────── Auth guard ──────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'artisan') {
      toast.error('Please login as an artisan');
      navigate('/login');
    }
  }, [navigate]);

  // ────── Fetch products on mount ──────
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductServices.getUserProducts();
      setProducts(data.products || data || []);
    } catch (err) {
      console.error('Failed to load products', err);
      const msg = err?.response?.data?.detail || err?.message || 'Failed to load products';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(productId);
      await ProductServices.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      setProducts((prev) => prev.filter(p => (p.product_id || p.id || p.productId) !== productId));
      if (selectedProduct && (selectedProduct.product_id === productId || selectedProduct.id === productId)) {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Delete failed', err);
      const msg = err?.response?.data?.detail || err?.message || 'Delete failed';
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    localStorage.setItem('editingProduct', JSON.stringify(product));
    navigate('/upload'); // or to `/edit-product`
  };

  const openProduct = (product) => setSelectedProduct(product);
  const closeProduct = () => setSelectedProduct(null);

  const formatDateToIST = (isoString) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 pt-20 relative flex items-center justify-center">
        <CanvasBackground
          backgroundColor="#f9feffff"
          elementColors={['#ff620062', '#005cdc5a']}
        />
        <div className="p-6 relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-900 font-semibold">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-20 relative">
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={['#ff620062', '#005cdc5a']}
      />
      <ToastContainer />

      <div className="p-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2 text-amber-900">
                My Products ({products.length})
              </h1>
              <p className="text-amber-700 font-semibold">
                Manage your digital storefront
              </p>
            </div>
            <PrimaryButton
              onClick={() => navigate('/upload')}
              icon={<Plus className="h-5 w-5" />}
            >
              Add Product
            </PrimaryButton>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-amber-50/50 rounded-2xl p-12">
              <div className="w-24 h-24 bg-amber-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Plus className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2 text-amber-900">
                No products yet
              </h2>
              <p className="text-amber-700 mb-6">
                Create your first masterpiece and share it with the world
              </p>
              <PrimaryButton
                onClick={() => navigate('/upload')}
                size="lg"
                icon={<Plus className="h-5 w-5" />}
              >
                Create First Product
              </PrimaryButton>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const pid = product.product_id || product.productId || product.id;
                return (
                  <article key={pid || Math.random()} className="group">
                    <div
                      className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                      onClick={() => openProduct(product)}
                    >
                      {/* Product Image */}
                      <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200 relative overflow-hidden">
                        {product.image_urls && product.image_urls.length > 0 ? (
                          <img
                            src={product.image_urls[0]}
                            alt={product.story?.Title || product.title || 'Product'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-500">
                            <Plus className="h-16 w-16" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                            {product.story?.Category || product.category || 'Uncategorized'}
                          </span>
                        </div>

                        <h3 className="text-xl font-serif font-bold text-amber-900 mb-1 line-clamp-2">
                          {product.story?.Title || product.title || 'Untitled'}
                        </h3>

                        <p className="text-amber-700 text-sm mb-4 line-clamp-2">
                          {product.story?.Tagline || product.tagline || ''}
                        </p>

                        <div className="flex items-center space-x-2 text-xs text-amber-600 mb-4">
                          <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium">
                              {(product.artisan_details?.name || product.artisan_name || 'A')?.[0] || 'A'}
                            </span>
                          </div>
                          <span>{product.artisan_details?.shop_name || product.shop_name || ''}</span>
                          <span>•</span>
                          <span>{product.artisan_details?.location || product.location || ''}</span>
                        </div>

                        <div className="flex space-x-2">
                          <PrimaryButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                            icon={<Edit3 className="h-4 w-4" />}
                          >
                            Edit
                          </PrimaryButton>
                          <PrimaryButton
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={(e) => { e.stopPropagation(); handleDelete(pid); }}
                            icon={<Trash2 className="h-4 w-4" />}
                            disabled={deletingId === pid}
                            loading={deletingId === pid}
                          >
                            {deletingId === pid ? 'Deleting...' : 'Delete'}
                          </PrimaryButton>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Navigation userRole="artisan" />

      {/* ---------------- Modal / Product Detail ---------------- */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeProduct}
            aria-hidden="true"
          />

          {/* modal content */}
          <div className="relative z-60 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-amber-900">
                  {selectedProduct.story?.Title || 'Untitled'}
                </h2>
                <p className="text-sm text-amber-700 mt-1">
                  {selectedProduct.story?.Tagline || ''}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <PrimaryButton
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(selectedProduct)}
                  icon={<Edit3 className="h-4 w-4" />}
                >
                  Edit
                </PrimaryButton>
                <PrimaryButton
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(selectedProduct.product_id || selectedProduct.id || selectedProduct.productId)}
                  icon={<Trash2 className="h-4 w-4" />}
                  disabled={deletingId === (selectedProduct.product_id || selectedProduct.id || selectedProduct.productId)}
                  loading={deletingId === (selectedProduct.product_id || selectedProduct.id || selectedProduct.productId)}
                >
                  {deletingId === (selectedProduct.product_id || selectedProduct.id || selectedProduct.productId) ? 'Deleting...' : 'Delete'}
                </PrimaryButton>
                <button
                  onClick={closeProduct}
                  className="ml-2 text-amber-700 underline text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: image(s) */}
              <div>
                {selectedProduct.image_urls && selectedProduct.image_urls.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProduct.image_urls.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${selectedProduct.story?.Title || 'Product'} ${i + 1}`}
                        className="w-full h-80 object-contain rounded-lg bg-amber-50"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-80 flex items-center justify-center bg-amber-50 rounded-lg">
                    <Plus className="h-12 w-12 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Right: detailed metadata */}
              <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-amber-900">{selectedProduct.story?.Category || '—'}</p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Material</p>
                  <p className="text-amber-900">{selectedProduct.story?.Material || '—'}</p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Method</p>
                  <p className="text-amber-900">{selectedProduct.story?.Method || '—'}</p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">For Whom</p>
                  <p className="text-amber-900">{selectedProduct.story?.ForWhom || '—'}</p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Cultural Significance</p>
                  <p className="text-amber-900 whitespace-pre-line">{selectedProduct.story?.CulturalSignificance || '—'}</p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Artisan</p>
                  <p className="text-amber-900 font-medium">{selectedProduct.artisan_details?.name || selectedProduct.story?.WhoMadeIt?.Name || '—'}</p>
                  <p className="text-sm text-amber-700">
                    {selectedProduct.artisan_details?.shop_name || selectedProduct.story?.WhoMadeIt?.['Shop Name'] || ''}
                    {selectedProduct.artisan_details?.location ? ` • ${selectedProduct.artisan_details.location}` : ''}
                  </p>
                </div>

                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Timestamp</p>
                  <p className="text-amber-900">{formatDateToIST(selectedProduct.timestamp)}</p>
                </div>

                {/* Transcript (if present) */}
                {(selectedProduct.voice_transcript_english || selectedProduct.voice_transcript_original) && (
                  <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Voice Transcript</p>
                    <p className="text-amber-900 whitespace-pre-line">
                      {selectedProduct.voice_transcript_english || selectedProduct.voice_transcript_original}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* long story content below images */}
            <div className="mt-6 space-y-4">
              <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">Full Story</p>
                <div className="text-amber-900 whitespace-pre-line">
                  <p className="font-semibold mb-2">{selectedProduct.story?.Title}</p>
                  <p className="mb-2">{selectedProduct.story?.Tagline}</p>
                  <p className="text-sm text-amber-700">{selectedProduct.story?.CulturalSignificance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
