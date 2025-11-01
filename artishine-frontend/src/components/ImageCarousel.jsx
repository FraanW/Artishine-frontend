import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './MapStyles.css';

const ImageCarousel = ({ images, billboardTitle, onImageClick, setSelectedMarker }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="carousel-container" onClick={onImageClick}>
      <img
        src={images[currentSlide] || '/images/fallback.jpg'}
        alt={`${billboardTitle} - Image ${currentSlide + 1}`}
        className="carousel-img"
        onError={(e) => {
          e.target.src = '/images/fallback.jpg';
        }}
      />
      {images.length > 1 && (
        <>
          <button onClick={prevSlide} className="carousel-nav-btn carousel-prev-btn">
            <FaChevronLeft />
          </button>
          <button onClick={nextSlide} className="carousel-nav-btn carousel-next-btn">
            <FaChevronRight />
          </button>
        </>
      )}
      <div className="carousel-overlay">
        <div className="carousel-overlay-text">🔍 Click to view gallery</div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('InfoWindow closed');
          setSelectedMarker(null);
        }}
        className="carousel-close-btn"
      >
        ✕
      </button>
    </div>
  );
};

export default ImageCarousel;