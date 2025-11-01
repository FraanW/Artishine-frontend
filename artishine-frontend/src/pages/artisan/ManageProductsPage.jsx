import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import ProductManagementCard from '../../components/ProductManagementCard';
import Navigation from '../../components/Navigation';
import CanvasBackground from '../../components/CanvasBackground';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import AuthServices from '../../services/AuthServices';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await AuthServices.getMyProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(productId);
      await AuthServices.deleteProduct(productId);
      toast.success('Product deleted successfully!');
      
      // Refresh the list
      setProducts(products.filter(p => p.product_id !== productId));
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (product) => {
    // Store product in localStorage for edit page
    localStorage.setItem('editingProduct', JSON.stringify(product));
    navigate('/upload'); // or create /edit-product page
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
              {products.map((product) => (
                <div key={product.product_id} className="group">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    {/* Product Image */}
                    <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200 relative overflow-hidden">
                      {product.image_urls && product.image_urls.length > 0 ? (
                        <img
                          src={product.image_urls[0]}
                          alt={product.story?.Title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
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
                          {product.story?.Category || 'Uncategorized'}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-serif font-bold text-amber-900 mb-1 line-clamp-2">
                        {product.story?.Title || 'Untitled'}
                      </h3>
                      
                      <p className="text-amber-700 text-sm mb-4 line-clamp-2">
                        {product.story?.Tagline}
                      </p>

                      {/* Artisan Info */}
                      <div className="flex items-center space-x-2 text-xs text-amber-600 mb-4">
                        <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {product.artisan_details?.name?.[0] || 'A'}
                          </span>
                        </div>
                        <span>{product.artisan_details?.shop_name}</span>
                        <span>•</span>
                        <span>{product.artisan_details?.location}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <PrimaryButton
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(product)}
                          icon={<Edit3 className="h-4 w-4" />}
                        >
                          Edit
                        </PrimaryButton>
                        <PrimaryButton
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleDelete(product.product_id)}
                          icon={<Trash2 className="h-4 w-4" />}
                          disabled={deletingId === product.product_id}
                          loading={deletingId === product.product_id}
                        >
                          {deletingId === product.product_id ? 'Deleting...' : 'Delete'}
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Navigation userRole="artisan" />
    </div>
  );
};

export default ManageProductsPage;