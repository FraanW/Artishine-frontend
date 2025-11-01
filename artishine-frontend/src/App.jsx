import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import BackgroundScribbles from './components/BackgroundScribbles';
import EpicGradientBackground from './components/EpicGradientBackground';
import CustomCursor from './components/CustomCursor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import HomePage from './pages/HomePage';
import UploadProductPage from './pages/artisan/UploadProductPage';
import ManageProductsPage from './pages/artisan/ManageProductsPage';
import OrdersDashboardPage from './pages/artisan/OrdersDashboardPage';
import AnalyticsDashboardPage from './pages/artisan/AnalyticsDashboardPage';
import MapPage from './pages/buyer/MapPage';
import ExplorePage from './pages/buyer/ExplorePage';
import CartPage from './pages/buyer/CartPage';
import ProfilePageBuyer from './pages/buyer/ProfilePageBuyer';
import ProfilePageArtisan from './pages/artisan/ProfilePageArtisan';

const AppShell = () => {
  const token = localStorage.getItem('token');

  return (
    <>
      <CustomCursor />
      {token ? <EpicGradientBackground /> : <BackgroundScribbles />}
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Login and Register routes without automatic redirects */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Artisan Routes */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-products"
            element={
              <ProtectedRoute>
                <ManageProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-artisan"
            element={
              <ProtectedRoute>
                <ProfilePageArtisan />
              </ProtectedRoute>
            }
          />

          {/* Buyer Routes */}
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/explore"
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Routes - Role-based */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePageBuyer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/artisan/profile"
            element={
              <ProtectedRoute>
                <ProfilePageArtisan />
              </ProtectedRoute>
            }
          />

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => {
  return <AppShell />;
};

export default App;