import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import './MapStyles.css';

const ArtisanCard = ({ artisan, onLocateOnMap, onArtisanClick, isSelected }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLocateClick = () => {
    onLocateOnMap(artisan);
  };

  // Filter out empty or invalid image URLs
  const validImages = artisan.images.filter(img => img && typeof img === 'string' && img.trim() !== '');

  // Use fallback if no valid images
  const displayImages = validImages.length > 0 ? validImages : ['/images/fallback.jpg'];

  // Auto-slideshow effect for card images
  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [displayImages.length]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleCardClick = () => {
    if (onArtisanClick) {
      onArtisanClick(artisan);
    }
  };

  return (
    <div
      className={`artisan-card ${isSelected ? 'artisan-card-selected' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: onArtisanClick ? 'pointer' : 'default' }}
    >
      {/* Image Section */}
      <div className="artisan-card-image-container">
        <img
          src={displayImages[currentImageIndex]}
          alt={artisan.shopName}
          className="artisan-card-image"
          onError={(e) => {
            e.target.src = '/images/fallback.jpg';
          }}
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="artisan-card-nav-btn artisan-card-prev-btn"
            >
              <ChevronLeft className="artisan-card-nav-icon" />
            </button>
            <button
              onClick={nextImage}
              className="artisan-card-nav-btn artisan-card-next-btn"
            >
              <ChevronRight className="artisan-card-nav-icon" />
            </button>
          </>
        )}

        <div className="artisan-card-image-overlay">
          <div className="artisan-card-image-count">
            {displayImages.length} photos
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="artisan-card-content">
        <h3 className="artisan-card-shop-name">{artisan.shopName}</h3>
        <p className="artisan-card-artisan-name">by {artisan.name}</p>
        <div className="artisan-card-location">
          <MapPin className="artisan-card-location-icon" />
          <span>{artisan.location}</span>
        </div>

        <div className="artisan-card-buttons">
          <button
            onClick={handleLocateClick}
            className="artisan-card-reach-btn"
          >
            <Rocket className="artisan-card-reach-icon" />
            Reach out
          </button>
          <button
            onClick={handleLocateClick}
            className="artisan-card-locate-btn"
          >
            <MapPin className="artisan-card-locate-icon" />
            Locate on Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtisanCard;