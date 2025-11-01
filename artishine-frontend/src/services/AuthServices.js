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
}

export default new AuthServices();