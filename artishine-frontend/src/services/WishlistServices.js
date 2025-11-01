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
}

export default new WishlistServices();