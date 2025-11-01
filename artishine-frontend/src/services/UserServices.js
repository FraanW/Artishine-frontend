// src/services/UserService.js
import http from "../api";   // <-- same axios instance used everywhere

class UserService {
    getProfile() {
        return http.get("/users/me");
    }
  
    updateProfile(data) {
        return http.patch("/users/me", data);
    }

    uploadPhoto(file) {
        const formData = new FormData();
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
}

export default new UserService();
