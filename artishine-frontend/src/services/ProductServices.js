import http from "../api"; // axios instance

class ProductServices {
  // ───── Existing Endpoints ─────
  getAllProducts() {
    return http.get("/products");
  }

  getAllProductsforMap() {
    return http.get("/map/artisans");
  }

  getArtisanProducts(artisanId) {
    return http.get(`/products/${artisanId}/products`);
  }

  // ───── New Endpoint: Fetch current user's products ─────
  async getUserProducts() {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      throw new Error("User ID not found in localStorage");
    }

    try {
      const response = await http.get(`/products/${userId}/products`, {
        headers: {
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user products:", error);
      throw error;
    }
  }

  // ───── DELETE ─────
  async deleteProduct(productId) {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("User ID not found in localStorage");

    await http.delete(`/products/${userId}/products/${productId}`);
    return { success: true };
  }

  // ───── PATCH (edit) ─────
  async updateProduct(productId, updates) {
    const userId = localStorage.getItem("user_id");
    if (!userId) throw new Error("User ID not found in localStorage");

    const { data } = await http.patch(
      `/products/${userId}/products/${productId}`,
      updates,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;               // updated document
  
    getProductById(productId) {
    return http.get(`/products/${productId}`);
  }
}

export default new ProductServices();
