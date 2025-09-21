import React, { useState } from 'react';
import sampleData from '../../data/sampleData';
import { MapPin, Search, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  // Use coordinates from sampleData
  const artisans = sampleData.artisans;

  // Extract all coordinates for bounds calculation
  const coordinates = artisans.map(a => a.coordinates);

  // Calculate map bounds to fit all pins
  const getMapBounds = (coords) => {
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);
    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs),
    };
  };

  // Center map to India and zoom to fit all pins
  const defaultCenter = { lat: 22.9734, lng: 78.6569 };
  const bounds = getMapBounds(coordinates);

  // Google Maps API key (replace with your own)
  const GOOGLE_MAPS_API_KEY = "AIzaSyDX0cgZmnb7oE5u-C4UOvk9coIUhZ9Q9bs";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  return (
    <div className="min-h-screen  pb-20 pt-20">
      <div className="relative h-screen">
        <div className="absolute top-6 left-6 right-6 z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for crafts, artisans, or locations..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 shadow-elegant"
            />
          </div>
        </div>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={defaultCenter}
            zoom={5}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              minZoom: 4,
              maxZoom: 10,
              gestureHandling: 'greedy',
            }}
            onLoad={map => {
              const google = window.google;
              if (google && map && coordinates.length > 1) {
                const boundsObj = new google.maps.LatLngBounds();
                coordinates.forEach(c => boundsObj.extend(c));
                map.fitBounds(boundsObj, 50);
              }
            }}
          >
            {artisans.map((artisan) => (
              artisan.coordinates && (
                <Marker
                  key={artisan.id}
                  position={artisan.coordinates}
                  onClick={() => setSelectedArtisan(artisan)}
                />
              )
            ))}
            {selectedArtisan && selectedArtisan.coordinates && (
              <InfoWindow
                position={selectedArtisan.coordinates}
                onCloseClick={() => setSelectedArtisan(null)}
              >
                <div className="space-y-1">
                  <strong>{selectedArtisan.name}</strong>
                  <div className="text-primary text-sm">{selectedArtisan.specialty}</div>
                  <div className="text-xs text-muted-foreground">{selectedArtisan.location}</div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}

        {/* Details modal retained for non-map info, if needed */}
      </div>
      <Navigation userRole="buyer" />
    </div>
  );
};

export default MapPage;


