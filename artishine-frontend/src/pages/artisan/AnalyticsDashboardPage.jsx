import React, { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { Heart, Package, Instagram } from 'lucide-react';
import ProductServices from '../../services/ProductServices';
import WishlistServices from '../../services/WishlistServices';
import { toast } from 'react-toastify';

// --- 1. IMPORT THE CANVAS BACKGROUND ---
import CanvasBackground from '../../components/CanvasBackground';

const AnalyticsDashboardPage = () => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('user_id');

        if (userId) {
          // Get user's products to count total products
          const productsResponse = await ProductServices.getUserProducts();
          const products = Array.isArray(productsResponse) ? productsResponse : productsResponse.products || [];
          setTotalProducts(products.length);

          // Get wishlist stats for artisan (how many times their products were wishlisted)
          const wishlistResponse = await WishlistServices.getArtisanWishlistStats(userId);
          setWishlistCount(wishlistResponse.data?.total_entries || 0);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data', {
          position: 'top-center',
          autoClose: 2000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    // --- 2. ADD 'relative' TO THE MAIN WRAPPER ---
    <div className="min-h-screen pb-20 pt-32 relative">

      {/* --- 3. ADD THE CANVAS BACKGROUND WITH YOUR COLORS --- */}
      <CanvasBackground
        backgroundColor="#f9feffff" // Using the light color you requested
        elementColors={['#ff620062', '#005cdc5a']} // Using the element colors you requested
      />

      {/* --- 4. ADD 'relative z-10' TO YOUR CONTENT WRAPPER --- */}
      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            {/* --- 5. TEXT COLORS UPDATED FOR LIGHT BACKGROUND --- */}
            <h1 className="text-3xl font-serif font-bold mb-2 text-amber-900">Analytics Dashboard</h1>
            <p className="text-amber-700 font-semibold">Track your social media presence</p>
          </div>

          {/* Analytics Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-amber-900">Wishlist Hits</h3>
                  <p className="text-sm text-amber-700">Buyers who wishlisted your products</p>
                </div>
              </div>
              <div className="mt-4">
                {loading ? (
                  <div className="text-3xl font-bold text-amber-600">...</div>
                ) : (
                  <div className="text-3xl font-bold text-amber-600">{wishlistCount}</div>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-amber-900">Total Products</h3>
                  <p className="text-sm text-amber-700">Your published products</p>
                </div>
              </div>
              <div className="mt-4">
                {loading ? (
                  <div className="text-3xl font-bold text-amber-600">...</div>
                ) : (
                  <div className="text-3xl font-bold text-amber-600">{totalProducts}</div>
                )}
              </div>
            </div>
          </div>

          {/* Instagram Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-2">
              Exapand your products visibility on Artishine
            </h2>
            <p className="text-amber-700 text-lg mb-1">
              अपने उत्पादों को आर्टिशाइन पर देखें
            </p>
            <p className="text-amber-700 text-lg">
              உங்கள் தயாரிப்புகளை ஆர்டிஷைனில் காண்க
            </p>
          </div>

          {/* Instagram Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
            <div className="p-6 border-b border-amber-200 bg-gradient-to-r from-pink-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Instagram className="h-8 w-8 text-pink-600" />
                  <div>
                    <h3 className="text-xl font-serif font-bold text-amber-900">Artishine on Instagram</h3>
                    <p className="text-sm text-amber-700">@artishine_pixelite</p>
                  </div>
                </div>
                <a
                  href="https://www.instagram.com/artishine_pixelite/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                  <Instagram className="h-5 w-5" />
                  <span>View on Instagram</span>
                </a>
              </div>
            </div>

            {/* Instagram Preview/Browser Style */}
            <div className="relative bg-gray-100">
              {/* Browser-like top bar */}
              <div className="bg-gray-200 px-4 py-2 flex items-center space-x-2 border-b border-gray-300">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-600 border border-gray-300">
                  instagram.com/artishine_pixelite
                </div>
              </div>

              {/* Instagram-like content preview */}
              <div className="p-8 text-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 min-h-[60vh] flex flex-col items-center justify-center">
                <div className="mb-8">
                  <Instagram className="h-24 w-24 text-pink-600 mx-auto mb-4" />
                  <h4 className="text-2xl font-serif font-bold text-amber-900 mb-2">Artishine</h4>
                  <p className="text-amber-700 mb-4">@artishine_pixelite</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">1.2K</div>
                    <div className="text-sm text-amber-700">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">850</div>
                    <div className="text-sm text-amber-700">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900">120</div>
                    <div className="text-sm text-amber-700">Following</div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-amber-800 font-medium mb-2">Discover handcrafted treasures ✨</p>
                  <p className="text-amber-700 text-sm max-w-sm">
                    Connecting artisans with buyers through authentic, handcrafted products.
                    Each piece tells a unique story of craftsmanship and tradition.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
                  <h5 className="font-semibold text-amber-900 mb-3">Recent Activity</h5>
                  <div className="space-y-2 text-sm text-amber-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span>New artisan joined the platform</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Product featured in local showcase</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Customer review: "Absolutely stunning craftsmanship!"</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <a
                    href="https://www.instagram.com/artishine_pixelite/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg text-lg"
                  >
                    <Instagram className="h-6 w-6" />
                    <span>Open Instagram</span>
                  </a>
                  <p className="text-xs text-amber-600 mt-2">Click to view the full Instagram experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation userRole="artisan" />
    </div>
  );
};

export default AnalyticsDashboardPage;