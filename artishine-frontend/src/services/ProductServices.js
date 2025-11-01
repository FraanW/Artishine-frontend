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
}

export default new ProductServices();
