import React from 'react';
import { X, MapPin, Phone, Mail, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactModal = ({ artisan, isOpen, onClose }) => {
  if (!artisan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="contact-modal-backdrop"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="contact-modal"
          >
            {/* Header */}
            <div className="contact-modal-header">
              <h2 className="contact-modal-title">Contact Artisan</h2>
              <button
                onClick={onClose}
                className="contact-modal-close-btn"
              >
                <X className="contact-modal-close-icon" />
              </button>
            </div>

            {/* Content */}
            <div className="contact-modal-content">
              {/* Shop Info */}
              <div className="contact-shop-info">
                <div className="contact-shop-name">
                  <Building className="contact-shop-icon" />
                  <span>{artisan.shop_name || 'Unknown Shop'}</span>
                </div>
                <div className="contact-artisan-name">
                  by {artisan.name || 'Unknown Artisan'}
                </div>
              </div>

              {/* Contact Details */}
              <div className="contact-details">
                <div className="contact-detail-item">
                  <MapPin className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <div className="contact-detail-label">Location</div>
                    <div className="contact-detail-value">{artisan.place || 'Unknown Location'}</div>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <Phone className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <div className="contact-detail-label">Phone</div>
                    <div className="contact-detail-value">{artisan.phone_number || 'Not available'}</div>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <Mail className="contact-detail-icon" />
                  <div className="contact-detail-content">
                    <div className="contact-detail-label">Email</div>
                    <div className="contact-detail-value">{artisan.email || 'Not available'}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="contact-actions">
                {artisan.phone_number && (
                  <a
                    href={`tel:${artisan.phone_number}`}
                    className="contact-action-btn contact-call-btn"
                  >
                    <Phone className="contact-action-icon" />
                    Call Now
                  </a>
                )}

                {artisan.email && (
                  <a
                    href={`mailto:${artisan.email}`}
                    className="contact-action-btn contact-email-btn"
                  >
                    <Mail className="contact-action-icon" />
                    Send Email
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;