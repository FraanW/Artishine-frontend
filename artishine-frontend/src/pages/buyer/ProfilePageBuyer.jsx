import React, { useState, useEffect } from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import { User, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';

// --- 1. IMPORT THE CANVAS BACKGROUND ---
import CanvasBackground from '../../components/CanvasBackground';

// --- IMPORT USER SERVICE ---
import UserService from '../../services/UserServices';

const ProfilePageBuyer = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    photo_url: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await UserService.getBuyerProfile();
        const data = res.data;

        // Map backend fields to frontend
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone_number || '',
          deliveryAddress: data.delivery_address || '',
          photo_url: data.photo_url || null,
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Could not load your profile. Please try again.", {
          position: 'top-center',
          autoClose: 3000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file", {
        position: 'top-center',
        autoClose: 3000
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB", {
        position: 'top-center',
        autoClose: 3000
      });
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Upload photo
  const handleUploadPhoto = async () => {
    if (!photoFile) return;
    setUploading(true);
    try {
      const res = await UserService.uploadPhoto(photoFile);
      setProfile((p) => ({ ...p, photo_url: res.data.photo_url }));
      toast.success(res.data.message || "Photo uploaded successfully!", {
        position: 'top-center',
        autoClose: 3000
      });
      // Clear the photo selection after successful upload
      setPhotoFile(null);
      setPhotoPreview(null);
      // Reset the file input
      const fileInput = document.getElementById('buyer-photo-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Upload failed", {
        position: 'top-center',
        autoClose: 3000
      });
    } finally {
      setUploading(false);
    }
  };

  // Reset photo preview
  const cancelPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    // Reset the file input
    const fileInput = document.getElementById('buyer-photo-input');
    if (fileInput) fileInput.value = '';
  };

  // Save handler
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updateData = {
        name: profile.name.trim() || undefined,
        phone: profile.phone?.trim() || undefined,
        deliveryAddress: profile.deliveryAddress?.trim() || undefined,
      };
      const res = await UserService.updateBuyerProfile(updateData);
      toast.success(res.data.message || "Profile saved successfully!", {
        position: 'top-center',
        autoClose: 3000
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Save failed", {
        position: 'top-center',
        autoClose: 3000
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Loader2 className="animate-spin h-12 w-12 text-amber-600" />
      </div>
    );
  }

  return (
    // --- 2. ADD 'relative' TO THE MAIN WRAPPER ---
    <div className="min-h-screen pb-20 pt-32 relative">

      {/* --- 3. ADD THE CANVAS BACKGROUND WITH YOUR COLORS --- */}
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={['#ff620062', '#005cdc5a']}
      />

      {/* --- 4. ADD 'relative z-10' TO YOUR CONTENT WRAPPER --- */}
      <div className="p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            {/* --- 5. TEXT COLORS UPDATED FOR LIGHT BACKGROUND --- */}
            <h1 className="text-3xl text-amber-900 font-serif font-bold mb-2">My Profile</h1>
            <p className="text-amber-700 font-semibold">Manage your account information</p>
          </div>
          <div className="space-y-6">
            <div className="text-center">
              <div className="relative inline-block">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 shadow-lg"
                  />
                ) : profile?.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-amber-300 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
                <input
                  id="buyer-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <PrimaryButton
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('buyer-photo-input').click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Choose Photo
                </PrimaryButton>

                {photoFile && (
                  <>
                    <PrimaryButton
                      onClick={handleUploadPhoto}
                      disabled={uploading}
                      size="sm"
                      className="flex items-center"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>Upload Photo</>
                      )}
                    </PrimaryButton>
                    <button
                      onClick={cancelPhoto}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* --- 7. CARD AND FORM COLORS UPDATED --- */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-900">Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-900">Email</label>
                <input type="email" value={profile.email} disabled className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none" />
                <p className="text-xs text-amber-600 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-900">Phone (Future Scope)</label>
                <input type="tel" value={profile.phone} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-900">Default Delivery Address (Future Scope)</label>
                <textarea value={profile.deliveryAddress} onChange={(e) => setProfile((prev) => ({ ...prev, deliveryAddress: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-none" />
              </div>
              <PrimaryButton
                size="lg"
                className="w-full"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
      <Navigation userRole="buyer" />
    </div>
  );
};

export default ProfilePageBuyer;