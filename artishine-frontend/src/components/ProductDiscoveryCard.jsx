import React, { useState } from 'react';
import PrimaryButton from './PrimaryButton';
import { Settings, Sparkles, Star, User, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDiscoveryCard = ({ product, onReachOut, isDesktop = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handleScroll = (e) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 50);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // Desktop layout
  if (isDesktop) {
    return (
      <div className="desktop-product-card">
        <div className="desktop-card-content">
          {/* Left side - Image Carousel */}
          <div className="desktop-image-section">
            <div className="desktop-image-container">
              {/* Image Carousel */}
              <div className="desktop-image-carousel">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="desktop-main-image"
                  onError={(e) => {
                    e.target.src = '/images/fallback.jpg';
                  }}
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="desktop-nav-arrow desktop-nav-left"
                    >
                      <ChevronLeft className="desktop-nav-icon" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="desktop-nav-arrow desktop-nav-right"
                    >
                      <ChevronRight className="desktop-nav-icon" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="desktop-image-counter">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}

                {/* Distance Indicator */}
                {product.distanceLabel && (
                  <div className="desktop-distance-badge">
                    {product.distanceLabel}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Information */}
          <div className="desktop-info-section">
            <div className="desktop-info-content">
              <div className="desktop-header">
                <h1 className="desktop-product-title">{product.title}</h1>
                <div className="desktop-product-meta">
                  <span className="desktop-category-badge">{product.category}</span>
                  <span className="desktop-material-text">{product.material}</span>
                </div>
              </div>

              <div className="desktop-info-scrollable">
                <div className="desktop-info-sections">
                  <div className="desktop-info-section">
                    <h3 className="desktop-section-title">
                      <User className="desktop-section-icon" />
                      Artisan
                    </h3>
                    <p className="desktop-section-content">{product.artisan} from {product.shop}</p>
                  </div>

                  <div className="desktop-info-section">
                    <h3 className="desktop-section-title">
                      <Sparkles className="desktop-section-icon" />
                      Made Of
                    </h3>
                    <p className="desktop-section-content">{product.material}</p>
                  </div>

                  <div className="desktop-info-section">
                    <h3 className="desktop-section-title">
                      <Settings className="desktop-section-icon" />
                      How It's Made
                    </h3>
                    <p className="desktop-section-content">{product.story?.Method || 'Traditional craftsmanship'}</p>
                  </div>

                  <div className="desktop-info-section">
                    <h3 className="desktop-section-title">
                      <Star className="desktop-section-icon" />
                      Cultural Significance
                    </h3>
                    <p className="desktop-section-content">{product.story?.CulturalSignificance || 'Handcrafted with traditional techniques'}</p>
                  </div>
                </div>

                <div className="desktop-action-section">
                  <PrimaryButton
                    onClick={() => onReachOut && onReachOut(product)}
                    size="lg"
                    className="desktop-reach-btn"
                    icon={<MessageCircle className="desktop-reach-icon" />}
                  >
                    Reach out to Artisan
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[85vh] w-full max-w-sm mx-auto card-warm overflow-hidden">
      <div className="h-full overflow-y-auto custom-scrollbar" onScroll={handleScroll}>
        <div className="relative h-96">
          {/* Image Carousel */}
          <div className="relative w-full h-full">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/images/fallback.jpg';
              }}
            />

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            )}
          </div>

          <div className="absolute inset-0 image-overlay"></div>

          {/* Distance Indicator */}
          {product.distanceLabel && (
            <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-medium">
              {product.distanceLabel}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-2xl font-serif font-bold mb-2">{product.title}</h2>
            <p className="text-sm opacity-90">{product.description}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{product.title}</h1>
            <div className="flex items-center text-muted-foreground text-sm space-x-2">
              <span className="bg-accent/20 text-accent px-2 py-1 rounded-full">{product.category}</span>
              <span className="text-sm text-muted-foreground">• {product.material}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-serif font-bold text-lg mb-2 flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" /> Artisan
              </h3>
              <p className="text-muted-foreground leading-relaxed">{product.artisan} from {product.shop}</p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" /> Made Of
              </h3>
              <p className="text-muted-foreground leading-relaxed">{product.material}</p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg mb-2 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-primary" /> How It's Made
              </h3>
              <p className="text-muted-foreground leading-relaxed">{product.story?.Method || 'Traditional craftsmanship'}</p>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg mb-2 flex items-center">
                <Star className="mr-2 h-5 w-5 text-primary" /> Cultural Significance
              </h3>
              <p className="text-muted-foreground leading-relaxed">{product.story?.CulturalSignificance || 'Handcrafted with traditional techniques'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              <span className="text-sm text-muted-foreground">Handcrafted with love</span>
            </div>
            <PrimaryButton onClick={() => onReachOut && onReachOut(product)} size="lg" className="w-full" icon={<MessageCircle className="h-5 w-5" />}>
              Reach out to Artisan
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDiscoveryCard;


