import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import ContactModal from '../../components/ContactModal';
import WishlistServices from '../../services/WishlistServices';
import ProductServices from '../../services/ProductServices';
import { toast } from 'react-toastify';

// --- 1. IMPORT THE CANVAS BACKGROUND ---
import CanvasBackground from '../../components/CanvasBackground';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactModalArtisan, setContactModalArtisan] = useState(null);
  const [exitingItemId, setExitingItemId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('user_id');
        if (!userId) {
          setLoading(false);
          return;
        }

        // Get wishlist items
        const wishlistResponse = await WishlistServices.getWishlist(userId);
        const wishlistRawData = wishlistResponse.data;
        setWishlistData(wishlistRawData.wishlist_items || []);

        if (wishlistRawData.wishlist_items && wishlistRawData.wishlist_items.length > 0) {
          // Get product details for each wishlist item
          const productPromises = wishlistRawData.wishlist_items.map(item =>
            ProductServices.getProductById(item.product_id)
          );

          const productResponses = await Promise.all(productPromises);
          const productsWithDetails = productResponses.map((response, index) => ({
            ...response.data,
            wishlist_id: wishlistRawData.wishlist_items[index].wishlist_id
          }));

          setWishlistItems(productsWithDetails);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist', {
          position: 'top-center',
          autoClose: 2000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      // Find the wishlist item to get the wishlist_id
      const itemToRemove = wishlistItems.find(item => item.product_id === productId);
      if (!itemToRemove || !itemToRemove.wishlist_id) {
        throw new Error('Wishlist item not found');
      }

      // Set exiting animation
      setExitingItemId(productId);

      // Call delete API
      await WishlistServices.removeFromWishlist(itemToRemove.wishlist_id);

      // Remove from local state after animation
      setTimeout(() => {
        setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
        setExitingItemId(null);
        toast.success('Removed from wishlist', {
          position: 'top-center',
          autoClose: 2000
        });
      }, 400); // Match animation duration

    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setExitingItemId(null);
      toast.error('Failed to remove from wishlist', {
        position: 'top-center',
        autoClose: 2000
      });
    }
  };

  const handleReachOut = (product) => {
    // Create artisan object from product data
    const artisan = {
      user_id: product.user_id,
      name: product.artisan_details?.name || 'Unknown Artisan',
      shop_name: product.artisan_details?.shop_name || 'Unknown Shop',
      place: product.artisan_details?.location || 'Unknown Location',
      email: null,
      phone_number: null
    };
    setContactModalArtisan(artisan);
  };

  const handleCloseContactModal = () => {
    setContactModalArtisan(null);
  };

  return (
    // --- 2. ADD 'relative' TO THE MAIN WRAPPER ---
    <div className="min-h-screen pb-20 pt-20 relative">

      {/* --- 3. ADD THE CANVAS BACKGROUND WITH YOUR COLORS --- */}
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={['#ff620062', '#005cdc5a']}
      />

      {/* --- 4. ADD 'relative z-10' TO YOUR CONTENT WRAPPER --- */}
      <div className="p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            {/* --- 5. TEXT COLORS UPDATED FOR LIGHT BACKGROUND --- */}
            <h1 className="text-3xl text-amber-900 font-serif font-bold mb-2">Your Wishlist</h1>
            <p className="text-amber-700 font-semibold">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-amber-900">Loading your wishlist...</div>
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  // --- 6. CARD STYLES UPDATED ---
                  <div
                    key={item.product_id}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 transition-all duration-400 ${
                      exitingItemId === item.product_id ? 'wishlist-card-exit-right' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image_urls?.[0] || '/placeholder-image.jpg'}
                        alt={item.story?.Title || 'Product'}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        {/* --- 7. TEXT COLORS UPDATED --- */}
                        <h3 className="font-serif font-bold text-lg text-amber-900 truncate">{item.story?.Title || 'Untitled Product'}</h3>
                        <p className="text-amber-700 text-sm truncate">{item.story?.Category || 'General'}</p>
                        <p className="text-amber-600 text-sm truncate">by {item.artisan_details?.shop_name || 'Unknown Shop'}</p>
                      </div>
                      <div className="flex flex-col space-y-2 flex-shrink-0 ml-2">
                        <button
                          onClick={() => handleReachOut(item)}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span className="hidden sm:inline">Reach Out</span>
                          <span className="sm:hidden">Contact</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.product_id)}
                          className="text-amber-600 hover:text-red-500 transition-colors p-2 flex items-center justify-center"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
          ) : (
            // --- 7. EMPTY STATE COLORS UPDATED ---
            <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
              <ShoppingCart className="h-16 w-16 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2 text-amber-900">Your wishlist is empty</h3>
              <p className="text-amber-700 font-semibold mb-6">Discover beautiful crafts in the explore section</p>
              <PrimaryButton onClick={() => (window.location.href = '/explore')}>Start Exploring</PrimaryButton>
            </div>
          )}
        </div>
      </div>
      <Navigation userRole="buyer" />

      {/* Contact Modal */}
      <ContactModal
        artisan={contactModalArtisan}
        isOpen={!!contactModalArtisan}
        onClose={handleCloseContactModal}
      />
    </div>
  );
};

export default WishlistPage;