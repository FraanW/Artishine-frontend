import http from "../api";

class AuthServices {
  login(data) {
    return http.post("/users/login", data);
    }
    Buyerregister(data) {
    return http.post("/users/register-buyer", data);
    }
    Artisanregister(data) {
    return http.post("/users/register", data);
    }

// Artisine side Profile & upload services
  getProfile() {
    return http.get("users/me");  
  }

  //backend endpoint yeluthanum
  /*
  updateProfile(data) {
    return http.patch("users/profile", data);  
  }
  */

  getOrders() {
    return http.get("/orders");  
  }

  //should we write
  /*
  updateOrderStatus(id, status) {
    return http.patch(`/orders/${id}/status`, { status });
  }
  */

  getMyProducts() {
    return http.get("/products/my-products");  
  }

  uploadProduct(formData) {
    return http.post("/products/create-product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  //need to create or leave it ??
  /*
  getAnalytics() {
    return http.get("/analytics");  
  }
  */

}

export default new AuthServices();