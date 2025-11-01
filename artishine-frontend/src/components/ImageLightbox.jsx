import React, { useState, useEffect } from 'react';
import './MapStyles.css';

const ImageLightbox = ({ isOpen, onClose, billboardTitle, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lightbox-container">
      <button onClick={onClose} className="lightbox-close-btn">✕</button>
      <div className="lightbox-title">{billboardTitle}</div>
      <div className="lightbox-counter">{currentImageIndex + 1} / {images.length}</div>
      <div className="lightbox-image-container">
        <button onClick={prevImage} className="lightbox-nav-btn lightbox-prev-btn">‹</button>
        <img
          src={images[currentImageIndex]}
          alt={`${billboardTitle} - Image ${currentImageIndex + 1}`}
          className="lightbox-image"
          key={currentImageIndex}
        />
        <button onClick={nextImage} className="lightbox-nav-btn lightbox-next-btn">›</button>
      </div>
      <div className="lightbox-thumbnails">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => goToImage(index)}
            className={`lightbox-thumbnail ${currentImageIndex === index ? 'active' : ''}`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="lightbox-thumbnail-img" />
          </div>
        ))}
      </div>
      <div className="lightbox-overlay" onClick={onClose} />
    </div>
  );
};

export default ImageLightbox;