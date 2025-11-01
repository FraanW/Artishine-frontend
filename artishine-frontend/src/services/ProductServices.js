import http from "../api";

class ProductServices {
  getAllProducts() {
    return http.get("/products");
  }

  getAllProductsforMap() {
    return http.get("/map/artisans");
  }

  getArtisanProducts(artisanId) {
    return http.get(`/products/${artisanId}/products`);
  }

  getProductById(productId) {
    return http.get(`/products/${productId}`);
  }
}

export default new ProductServices();