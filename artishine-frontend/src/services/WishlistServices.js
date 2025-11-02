import http from "../api";

class WishlistServices {
  addToWishlist(userId, productData) {
    return http.post(`/wishlists/${userId}`, productData);
  }

  getWishlist(userId) {
    return http.get(`/wishlists/${userId}`);
  }

  removeFromWishlist(wishlistId) {
    return http.delete(`/wishlists/${wishlistId}`);
  }

  // Get wishlist data for artisan (how many times their products were wishlisted)
  getArtisanWishlistStats(userId) {
    return http.get(`/wishlists/artisan/${userId}`);
  }
}

export default new WishlistServices();