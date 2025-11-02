// src/services/UserService.js
import http from "../api";   // <-- same axios instance used everywhere

class UserService {
    getProfile() {
        return http.get("/users/me");
    }
  
    updateProfile(data) {
        const userId = localStorage.getItem('user_id');
        const payload = {
            user_id: userId,
            ...data
        };
        return http.patch("/users/me", payload);
    }

    uploadPhoto(file) {
        const userId = localStorage.getItem('user_id');
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("file", file);
        return http.post("/users/me/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    generateBio() {
        return http.post("/users/me/generate-bio");
    }

    getBuyerProfile() {
        const userId = localStorage.getItem('user_id');
        return http.get(`/users/buyers/${userId}`);
    }

    updateBuyerProfile(data) {
        const userId = localStorage.getItem('user_id');
        const payload = {
            user_id: userId,
            ...data
        };
        return http.patch("/users/buyers/me", payload);
    }
}

export default new UserService();
