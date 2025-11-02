import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, MessageCircle, Menu, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import ArtisanTooltip from '../../components/ArtisanTooltip';
import ArtisanCard from '../../components/ArtisanCard';
import ArtisanDetailView from '../../components/ArtisanDetailView';
import ContactModal from '../../components/ContactModal';
import LoadingScreen from '../../components/LoadingScreen';
import ProductServices from '../../services/ProductServices';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import '../../components/MapStyles.css';

// --- 1. IMPORT THE CANVAS BACKGROUND ---
import CanvasBackground from '../../components/CanvasBackground';

const MapPage = () => {
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [selectedArtisanForDetail, setSelectedArtisanForDetail] = useState(null);
  const [contactModalArtisan, setContactModalArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(window.innerWidth < 1024); // Start open on mobile only
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const mapRef = useRef(null);

  // Use the artisans data directly from the API
  const artisans = React.useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products
      .filter(artisan => artisan.latitude && artisan.longitude)
      .map(artisan => ({
        id: artisan.user_id,
        name: artisan.name || 'Unknown Artisan',
        shopName: artisan.shop_name || 'Unknown Shop',
        place: artisan.place || 'Unknown Location',
        latitude: artisan.latitude,
        longitude: artisan.longitude,
        email: artisan.email || null,
        phone_number: artisan.phone_number || null,
        images: artisan.product_images || [],
        coordinates: {
          lat: artisan.latitude,
          lng: artisan.longitude
        }
      }));
  }, [products]);

  const coordinates = artisans.map(a => a.coordinates).filter(Boolean);

  const getMapBounds = (coords) => {
    if (coords.length === 0) return null;
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);
    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };
  };

  // Calculate center based on all markers
  const defaultCenter = coordinates.length > 0
    ? {
        lat: coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length,
        lng: coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length
      }
    : { lat: 22.9734, lng: 78.6569 };

  const bounds = coordinates.length > 0 ? getMapBounds(coordinates) : null;

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        const response = await ProductServices.getAllProductsforMap();
        setProducts(response.data.artisans || []);
      } catch (err) {
        console.error('Error fetching artisans:', err);
        setError('Failed to load artisan data');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  // Auto-fit bounds when artisans are loaded
  useEffect(() => {
    if (coordinates.length > 0 && window.google && window.google.maps) {
      // Small delay to ensure map is fully loaded
      const timer = setTimeout(() => {
        const google = window.google;
        // Find the map instance using the reference pattern from reference code
        const mapContainer = document.querySelector('[aria-label="Map"]');
        const mapInstance = mapContainer?.parentElement?.parentElement?.map;

        if (mapInstance && coordinates.length > 0) {
          const boundsObj = new google.maps.LatLngBounds();
          coordinates.forEach(coord => boundsObj.extend(coord));
          mapInstance.fitBounds(boundsObj, 50);
        }
      }, 2000); // Increased delay for better reliability

      return () => clearTimeout(timer);
    }
  }, [coordinates]);

  const handleLocateOnMap = (artisan) => {
    setSelectedArtisan(artisan);
    // Close mobile menu when locating on map
    if (!isDesktop) {
      setIsMobileMenuOpen(false);
    }

    // Pan to the artisan's location and zoom in
    if (mapRef.current && artisan.coordinates) {
      mapRef.current.panTo(artisan.coordinates);
      mapRef.current.setZoom(15);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMapClick = () => {
    // Close mobile menu when clicking on map
    if (!isDesktop) {
      setIsMobileMenuOpen(false);
    }
    setSelectedArtisan(null);
  };

  const handleArtisanClick = (artisan) => {
    setSelectedArtisanForDetail(artisan);
  };

  const handleBackToShops = () => {
    setSelectedArtisanForDetail(null);
  };

  const handleReachOut = (artisan) => {
    setContactModalArtisan(artisan);
  };

  const handleCloseContactModal = () => {
    setContactModalArtisan(null);
  };

  return (
    <div className="min-h-screen pb-20 pt-32 relative">
      {/* Canvas Background */}
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={['#ff620062', '#005cdc5a']}
      />

      {/* Mobile Hamburger Button */}
      {!isDesktop && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-24 right-4 z-50 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg border border-amber-200"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6 text-amber-700" /> : <Menu className="h-6 w-6 text-amber-700" />}
        </button>
      )}

      {/* Two Column Layout */}
      <div className="relative h-screen z-10 flex">
        {/* Map Column */}
        <div className="flex-1">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%' }}
              center={defaultCenter}
              zoom={5}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                minZoom: 3,
                maxZoom: 20,
                gestureHandling: 'greedy',
                restriction: null,
                clickableIcons: false,
              }}
              onLoad={map => {
                mapRef.current = map;
              }}
              onClick={() => {
                setSelectedArtisan(null);
              }}
            >
              {artisans.map((artisan) => (
                artisan.coordinates && (
                  <Marker
                    key={artisan.id}
                    position={artisan.coordinates}
                    onClick={(e) => {
                      e.stop();
                      setSelectedArtisan(artisan);
                    }}
                    options={{
                      clickable: true,
                      icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="18" fill="#8B4513" stroke="#654321" stroke-width="2"/>
                            <circle cx="20" cy="20" r="8" fill="#D2691E"/>
                            <circle cx="20" cy="20" r="4" fill="#FFF"/>
                          </svg>
                        `),
                        scaledSize: new window.google.maps.Size(40, 40),
                        anchor: new window.google.maps.Point(20, 40)
                      }
                    }}
                  />
                )
              ))}
              {selectedArtisan && selectedArtisan.coordinates && (
                <InfoWindow
                  position={selectedArtisan.coordinates}
                  onCloseClick={() => setSelectedArtisan(null)}
                  options={{
                    disableAutoPan: false,
                    closeOnMapClick: false,
                    disableAutoPan: false,
                    pixelOffset: new window.google.maps.Size(0, -10)
                  }}
                >
                  <ArtisanTooltip artisan={selectedArtisan} onClose={() => setSelectedArtisan(null)} />
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

        {/* Sidebar Column - Desktop Only */}
        {isDesktop && (
          <div className="w-80 bg-white shadow-lg border-l border-gray-200 flex flex-col overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedArtisanForDetail ? (
                <motion.div
                  key="detail-view"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <ArtisanDetailView
                    artisan={selectedArtisanForDetail}
                    onBack={handleBackToShops}
                    onReachOut={handleReachOut}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="shops-list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  {/* Sidebar Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-amber-900">Shops around you</h2>
                    <p className="text-sm text-amber-700 mt-1">Discover local artisans</p>
                  </div>

                  {/* Cards Container */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">
                      {artisans.map((artisan) => (
                        <ArtisanCard
                          key={artisan.id}
                          artisan={artisan}
                          onLocateOnMap={handleLocateOnMap}
                          onArtisanClick={handleArtisanClick}
                          onReachOut={handleReachOut}
                          isSelected={selectedArtisan?.id === artisan.id}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {!isDesktop && (
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 right-0 h-full w-3/4 bg-white shadow-2xl border-l border-gray-200 z-40 flex flex-col"
              >
                <AnimatePresence mode="wait">
                  {selectedArtisanForDetail ? (
                    <motion.div
                      key="detail-view"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1"
                    >
                      <ArtisanDetailView
                        artisan={selectedArtisanForDetail}
                        onBack={handleBackToShops}
                        onReachOut={handleReachOut}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="shops-list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full"
                    >
                      {/* Mobile Sidebar Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-amber-900">Shops around you</h2>
                          <p className="text-sm text-amber-700 mt-1">Discover local artisans</p>
                        </div>
                        <button
                          onClick={toggleMobileMenu}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="h-6 w-6 text-amber-700" />
                        </button>
                      </div>

                      {/* Cards Container */}
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="space-y-6">
                          {artisans.map((artisan) => (
                            <ArtisanCard
                              key={artisan.id}
                              artisan={artisan}
                              onLocateOnMap={handleLocateOnMap}
                              onArtisanClick={handleArtisanClick}
                              onReachOut={handleReachOut}
                              isSelected={selectedArtisan?.id === artisan.id}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Loading Screen */}
      {loading && <LoadingScreen text="Fetching artisans around you..." />}

      {error && (
        <div className="absolute top-20 left-6 right-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-20">
          {error}
        </div>
      )}

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

export default MapPage;