import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Package, Palette, MessageCircle } from 'lucide-react';
import ProductServices from '../services/ProductServices';
import './MapStyles.css';

const ArtisanDetailView = ({ artisan, onBack, onReachOut }) => {
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtisanProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductServices.getArtisanProducts(artisan.id);
        setArtisanProducts(response.data.products || []);
      } catch (err) {
        console.error('Error fetching artisan products:', err);
        setError('Failed to load artisan products');
      } finally {
        setLoading(false);
      }
    };

    if (artisan?.id) {
      fetchArtisanProducts();
    }
  }, [artisan?.id]);

  return (
    <div className="artisan-detail-view">
      {/* Header */}
      <div className="artisan-detail-header">
        <button
          onClick={onBack}
          className="artisan-detail-back-btn"
        >
          <ArrowLeft className="artisan-detail-back-icon" />
          Back to Shops
        </button>

        <div className="artisan-detail-info">
          <h2 className="artisan-detail-shop-name">{artisan.shopName}</h2>
          <p className="artisan-detail-artisan-name">by {artisan.name}</p>
          <div className="artisan-detail-location">
            <MapPin className="artisan-detail-location-icon" />
            <span>{artisan.location}</span>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="artisan-detail-products">
        <h3 className="artisan-detail-products-title">
          Products ({artisanProducts.length})
        </h3>

        {loading && (
          <div className="artisan-detail-loading">
            Loading products...
          </div>
        )}

        {error && (
          <div className="artisan-detail-error">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="artisan-detail-products-grid">
            {artisanProducts.map((product) => (
              <div key={product.product_id} className="artisan-product-card">
                {/* Product Image */}
                <div className="artisan-product-image-container">
                  <img
                    src={product.image_urls?.[0] || '/images/fallback.jpg'}
                    alt={product.story?.Title || 'Product'}
                    className="artisan-product-image"
                    onError={(e) => {
                      e.target.src = '/images/fallback.jpg';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="artisan-product-info">
                  <h4 className="artisan-product-title">
                    {product.story?.Title || 'Untitled Product'}
                  </h4>

                  <div className="artisan-product-details">
                    <div className="artisan-product-detail">
                      <Package className="artisan-product-detail-icon" />
                      <span>{product.story?.Category || 'N/A'}</span>
                    </div>

                    <div className="artisan-product-detail">
                      <Palette className="artisan-product-detail-icon" />
                      <span>{product.story?.Material || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Reach Out Button */}
                  <button
                    onClick={() => onReachOut && onReachOut(artisan)}
                    className="artisan-product-reach-btn"
                  >
                    <MessageCircle className="artisan-product-reach-icon" />
                    Reach out to Artisan
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDetailView;