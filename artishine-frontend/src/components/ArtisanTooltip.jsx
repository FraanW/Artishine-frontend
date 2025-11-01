import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import './MapStyles.css';

const ArtisanTooltip = ({ artisan, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter out empty or invalid image URLs
  const validImages = artisan.images.filter(img => img && typeof img === 'string' && img.trim() !== '');

  // Fallback image for shops without images
  const fallbackImage = '/images/fallback.jpg';

  // Use fallback if no valid images
  const displayImages = validImages.length > 0 ? validImages : [fallbackImage];

  // Auto-slideshow effect
  useEffect(() => {
    if (displayImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [displayImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="artisan-tooltip">
      {/* Image Carousel */}
      <div className="artisan-tooltip-image-container">
        <img
          src={displayImages[currentImageIndex]}
          alt={`${artisan.shopName} - Image ${currentImageIndex + 1}`}
          className="artisan-tooltip-image"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="artisan-tooltip-nav-btn artisan-tooltip-prev-btn"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="artisan-tooltip-nav-btn artisan-tooltip-next-btn"
            >
              ›
            </button>
          </>
        )}

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="artisan-tooltip-counter">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="artisan-tooltip-content">
        <h3 className="artisan-tooltip-shop-name">{artisan.shopName}</h3>
        <p className="artisan-tooltip-artisan-name">by {artisan.name}</p>
        <p className="artisan-tooltip-location">
          <span className="artisan-tooltip-location-icon">📍</span>
          {artisan.location}
        </p>

        <button className="artisan-tooltip-cta-btn">
          <MessageCircle className="artisan-tooltip-cta-icon" />
          Reach out
        </button>
      </div>
    </div>
  );
};

export default ArtisanTooltip;