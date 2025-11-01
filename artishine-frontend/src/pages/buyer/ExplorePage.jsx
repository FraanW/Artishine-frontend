import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import ProductDiscoveryCard from '../../components/ProductDiscoveryCard';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import LoadingScreen from '../../components/LoadingScreen';
import ContactModal from '../../components/ContactModal';
import ProductServices from '../../services/ProductServices';
import WishlistServices from '../../services/WishlistServices';
import { Heart, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// --- 1. IMPORT THE NEW CANVAS BACKGROUND ---
import CanvasBackground from '../../components/CanvasBackground';

const ExplorePage = () => {
  const [currentProducts, setCurrentProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [lastDirection, setLastDirection] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [contactModalArtisan, setContactModalArtisan] = useState(null);
  const [cardAnimationDirection, setCardAnimationDirection] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Get user location using IP address
  const getUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lng: data.longitude,
          city: data.city,
          region: data.region
        };
      }
    } catch (err) {
      console.error('Error getting user location:', err);
    }
    return null;
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle swipe logic for both keyboard and button clicks
  const handleSwipe = async (direction, productId) => {
    setLastDirection(direction);
    // Set animation direction for desktop
    if (isDesktop) {
      setCardAnimationDirection(direction);
      // Clear animation after it completes
      setTimeout(() => setCardAnimationDirection(null), 1200);
    }

    if (direction === 'right') {
      const product = currentProducts.find((p) => p.id === productId);
      if (product) {
        try {
          // Add to wishlist
          const userId = localStorage.getItem('user_id');
          if (userId) {
            await WishlistServices.addToWishlist(userId, {
              product_id: productId
            });
            // Show success toast
            toast.success('Added to wishlist!', {
              position: 'top-center',
              autoClose: 2000
            });
          }
        } catch (error) {
          console.error('Error adding to wishlist:', error);
          toast.error('Failed to add to wishlist', {
            position: 'top-center',
            autoClose: 2000
          });
        }

        // Show SweetAlert confirmation for contact
        Swal.fire({
          title: 'Product Liked! 🎉',
          text: 'Do you want to reach out to this artisan?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#f59e0b',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, contact them!',
          cancelButtonText: 'Maybe later'
        }).then((result) => {
          if (result.isConfirmed) {
            // Create artisan object from product data
            const artisan = {
              user_id: product.id,
              name: product.artisan,
              shop_name: product.shop,
              place: product.location,
              email: product.email || null,
              phone_number: product.phone || null
            };
            setContactModalArtisan(artisan);
          }
        });
      }
    }
    // Remove the card for both left and right swipes
    setCurrentProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Keyboard controls for desktop
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!isDesktop || currentProducts.length === 0) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const currentProduct = currentProducts[currentProducts.length - 1];
        if (currentProduct) {
          handleSwipe('left', currentProduct.id);
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        const currentProduct = currentProducts[currentProducts.length - 1];
        if (currentProduct) {
          handleSwipe('right', currentProduct.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isDesktop, currentProducts, handleSwipe]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get user location
        const location = await getUserLocation();
        setUserLocation(location);

        // Fetch products
        const response = await ProductServices.getAllProducts();
        const products = response.data.products || [];

        // Map API response to TinderCard format
        let mappedProducts = products.map(product => ({
          id: product.product_id,
          title: product.story?.Title || 'Untitled Product',
          description: product.story?.Tagline || '',
          price: product.price || 'Contact for price',
          category: product.story?.Category || 'General',
          material: product.story?.Material || 'Various materials',
          artisan: product.artisan_details?.name || 'Unknown Artisan',
          shop: product.artisan_details?.shop_name || 'Unknown Shop',
          location: product.artisan_details?.location || 'Unknown Location',
          latitude: product.artisan_details?.latitude,
          longitude: product.artisan_details?.longitude,
          images: product.image_urls || ['/images/fallback.jpg'],
          story: product.story || {},
          timestamp: product.timestamp,
          distance: null,
          distanceLabel: 'Location unknown'
        }));

        // Calculate distances and sort by proximity
        if (location) {
          mappedProducts = mappedProducts.map(product => {
            if (product.latitude && product.longitude) {
              const distance = calculateDistance(
                location.lat, location.lng,
                product.latitude, product.longitude
              );
              const distanceLabel = distance <= 50 ? 'Near you' : 'A drive away';
              return { ...product, distance, distanceLabel };
            }
            return product;
          });

          // Sort by distance (closest first)
          mappedProducts.sort((a, b) => {
            if (a.distance === null && b.distance === null) return 0;
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
        }

        setCurrentProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const swiped = async (direction, productId) => {
    setLastDirection(direction);
    if (direction === 'right') {
      const product = currentProducts.find((p) => p.id === productId);
      if (product) {
        // Show SweetAlert confirmation
        const result = await Swal.fire({
          title: 'Product Liked! 🎉',
          text: 'Do you want to reach out to this artisan?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#f59e0b',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Yes, contact them!',
          cancelButtonText: 'Maybe later'
        });

        if (result.isConfirmed) {
          // Create artisan object from product data
          const artisan = {
            user_id: product.id,
            name: product.artisan,
            shop_name: product.shop,
            place: product.location,
            email: product.email || null,
            phone_number: product.phone || null
          };
          setContactModalArtisan(artisan);
        }
      }
    }
  };

  const outOfFrame = (productId) => setCurrentProducts((prev) => prev.filter((p) => p.id !== productId));

  const handleReachOut = (product) => {
    // Create artisan object from product data
    const artisan = {
      user_id: product.id,
      name: product.artisan,
      shop_name: product.shop,
      place: product.location,
      email: product.email || null,
      phone_number: product.phone || null
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

      {/* Loading Screen */}
      {loading && <LoadingScreen text="Loading amazing crafts..." />}

      {/* --- 4. ADD 'relative z-10' TO CONTENT --- */}
      <div className="p-6 relative z-10">
        <div className="mx-auto">
          <div className={`text-center ${isDesktop ? 'mb-6' : 'mb-8'}`}>
            {/* --- 5. TEXT COLORS CHANGED TO AMBER --- */}
            <h1 className="text-3xl text-amber-900 font-serif font-bold mb-2">Discover Crafts</h1>
            <p className="text-amber-700 font-semibold">Swipe right to add to reach out, left to skip</p>
          </div>
          <div className="relative h-[85vh] mb-6">
            {currentProducts.length > 0 ? (
              isDesktop ? (
                // Desktop: Single wide card with animations
                <div className="relative flex items-center justify-center h-full">
                  {/* Left side indicator */}
                  <button
                    onClick={() => handleSwipe('left', currentProducts[currentProducts.length - 1]?.id)}
                    className="fixed left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center hover:bg-red-200 transition-colors duration-300 group-hover:animate-bounce">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-red-600 font-semibold text-sm">Pass</span>
                  </button>

                  {/* Right side indicator */}
                  <button
                    onClick={() => handleSwipe('right', currentProducts[currentProducts.length - 1]?.id)}
                    className="fixed right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-4 opacity-60 hover:opacity-100 transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center hover:bg-amber-200 transition-colors duration-300 group-hover:animate-bounce">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-amber-600 font-semibold text-sm">Reach out</span>
                  </button>

                  {/* Card with exit animation */}
                  <div className="relative overflow-hidden" style={{ zIndex: 10000 }}>
                    <div
                      key={currentProducts[currentProducts.length - 1]?.id}
                      className={isDesktop ? "desktop-card-enter" : "animate-in slide-in-from-bottom-4 duration-500"}
                      style={{
                        animation: cardAnimationDirection && isDesktop
                          ? `desktopCardChange${cardAnimationDirection === 'left' ? 'Left' : 'Right'} 0.6s ease-in-out forwards`
                          : undefined,
                        zIndex: 10001
                      }}
                    >
                      <ProductDiscoveryCard
                        product={currentProducts[currentProducts.length - 1]}
                        onReachOut={handleReachOut}
                        isDesktop={true}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Mobile: Tinder cards
                currentProducts.map((product) => (
                  <TinderCard key={product.id} onSwipe={(dir) => swiped(dir, product.id)} onCardLeftScreen={() => outOfFrame(product.id)} preventSwipe={['up', 'down']} className="absolute inset-0">
                    <ProductDiscoveryCard product={product} onReachOut={handleReachOut} />
                  </TinderCard>
                ))
              )
            ) : (
              // --- 6. EMPTY STATE COLORS UPDATED ---
              <div className="bg-white/80 backdrop-blur-sm h-full flex flex-col items-center justify-center text-center p-8 space-y-4 rounded-2xl shadow-lg">
                <Sparkles className="h-16 w-16 text-amber-500" />
                <h2 className="text-2xl font-serif font-bold text-amber-900">You've explored all crafts!</h2>
                <p className="text-amber-700 font-semibold">Check back later for new artisan creations</p>
                <PrimaryButton onClick={() => setCurrentProducts(sampleData.products)}>Restart Discovery</PrimaryButton>
              </div>
            )}
          </div>
          {currentProducts.length > 0 && !isDesktop && (
            // --- 7. BUTTON COLORS UPDATED - Only show on mobile ---
            <div className="flex items-center justify-center space-x-8">
              <button onClick={() => swiped('left', currentProducts[currentProducts.length - 1]?.id)} className="w-16 h-16 rounded-full bg-white border-2 border-red-300 flex items-center justify-center hover:bg-red-50 transition-all duration-300 hover:scale-110 shadow-lg">
                <X className="h-8 w-8 text-red-500" />
              </button>
              <button onClick={() => swiped('right', currentProducts[currentProducts.length - 1]?.id)} className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-all duration-300 hover:scale-110 shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </button>
            </div>
          )}

          {currentProducts.length > 0 && isDesktop && (
            // Desktop navigation hint
            <div className="text-center text-amber-700 font-medium">
              Use ← → arrow keys to navigate
            </div>
          )}
          {cartItems.length > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed top-6 right-6 bg-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg z-10">
              {cartItems.length}
            </motion.div>
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

export default ExplorePage;