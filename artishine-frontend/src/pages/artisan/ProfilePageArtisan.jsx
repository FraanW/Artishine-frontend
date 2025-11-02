import React, { useState, useEffect } from 'react';
import PrimaryButton from '../../components/PrimaryButton';
import Navigation from '../../components/Navigation';
import CanvasBackground from '../../components/CanvasBackground';
import UserService from '../../services/UserServices';
import { Instagram, Sparkles, User, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePageArtisan = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await UserService.getProfile(); // Assuming you add this to UserService
        const data = res.data;

        // Map backend fields to frontend
        setProfile({
          name: data.name || '',
          shopName: data.shop_name || '',
          location: data.place || '',
          bio: data.bio || '',
          phone: data.phone_number || '',
          typeOfWork: data.type_of_work || '',
          photo_url: data.photo_url || null,
          instagramHandle: data.instagram_handle || null,
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
      setProfile((p) => ({ ...p, photo_url: res.data.photo_url }));  // FIXED: Use res.data.photo_url
      toast.success(res.data.message || "Photo uploaded successfully!", {
        position: 'top-center',
        autoClose: 3000
      });
      // Clear the photo selection after successful upload
      setPhotoFile(null);
      setPhotoPreview(null);
      // Reset the file input
      const fileInput = document.getElementById('photo-input');
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

  // Save handler
  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updateData = {
        name: profile.name.trim() || undefined,  // Skip empty
        shopName: profile.shopName.trim() || undefined,
        location: profile.location.trim() || undefined,
        bio: profile.bio.trim() || undefined,
        phone: profile.phone?.trim() || undefined,
        typeOfWork: profile.typeOfWork?.trim() || undefined,
      };
      const res = await UserService.updateProfile(updateData);
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

  // Generate bio
  const handleGenerateBio = async () => {
    setGenerating(true);
    try {
      const res = await UserService.generateBio();
      setProfile((p) => ({ ...p, bio: res.data.generated_bio }));
    } catch (err) {
      alert("Failed to generate bio");
    } finally {
      setGenerating(false);
    }
  };

  // Reset photo preview
  const cancelPhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    // Reset the file input
    const fileInput = document.getElementById('photo-input');
    if (fileInput) fileInput.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Loader2 className="animate-spin h-12 w-12 text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-6 pt-32 relative overflow-hidden">
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={['#ff620062', '#005cdc5a']}
      />

      <div className="p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-amber-900">
              My Artisan Profile
            </h1>
            <p className="text-amber-700 font-semibold">
              Manage your identity, shop, and story
            </p>
          </div>

          {/* Profile Photo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-amber-300 shadow-lg"
                />
              ) : profile?.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-amber-300 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-16 w-16 text-white" />
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <PrimaryButton
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('photo-input').click()}
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

          {/* Profile Form */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-amber-900">
                Full Name
              </label>
              <input
                type="text"
                value={profile?.name || ''}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="e.g. Meera Devi"
              />
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-amber-900">
                Shop Name
              </label>
              <input
                type="text"
                value={profile?.shopName || ''}
                onChange={(e) => setProfile({ ...profile, shopName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="e.g. Clay Dreams Studio"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-amber-900">
                Location
              </label>
              <input
                type="text"
                value={profile?.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="e.g. Jaipur, Rajasthan"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-amber-900">
                Phone Number
              </label>
              <input
                type="tel"
                value={profile?.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="+91 9876543210"
              />
            </div>

            {/* Type of Work */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-amber-900">
                Type of Work
              </label>
              <input
                type="text"
                value={profile?.typeOfWork || ''}
                onChange={(e) => setProfile({ ...profile, typeOfWork: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                placeholder="e.g. Pottery, Textiles, Jewelry"
              />
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-amber-900">
                  About My Craft
                </label>
                {/* Generate Bio button hidden */}
                {/*
                <PrimaryButton
                  onClick={handleGenerateBio}
                  disabled={generating}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  {generating ? 'Generating...' : 'Generate Bio'}
                </PrimaryButton>
                */}
              </div>
              <textarea
                value={profile?.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none transition-all"
                placeholder="Tell your story, your craft, your passion..."
              />
            </div>

            {/* Instagram */}
            <div className="flex items-center justify-between p-4 border border-amber-300 rounded-lg bg-amber-50/50">
              <div className="flex items-center space-x-3">
                <Instagram className="h-6 w-6 text-pink-600" />
                <div>
                  <p className="font-medium text-amber-900">
                    {profile?.instagramHandle
                      ? `Connected as ${profile.instagramHandle}`
                      : 'Instagram Not Connected'}
                  </p>
                  <p className="text-sm text-amber-700">
                    {profile?.instagramHandle
                      ? 'Your products auto-post to Instagram'
                      : 'Connect to reach more customers'}
                  </p>
                </div>
              </div>
              <PrimaryButton
                variant={profile?.instagramHandle ? 'wood' : 'terracotta'}
                size="sm"
                onClick={() => {
                  toast.info("Instagram integration is coming soon! This feature will allow you to connect your account and auto-post your products.", {
                    position: 'top-center',
                    autoClose: 4000
                  });
                }}
              >
                {profile?.instagramHandle ? 'Disconnect' : 'Connect'}
              </PrimaryButton>
            </div>

            {/* Save Button */}
            <PrimaryButton
              onClick={handleSave}
              disabled={saving}
              size="lg"
              className="w-full text-lg font-semibold"
            >
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <Navigation userRole="artisan" />
    </div>
  );
};

export default ProfilePageArtisan;
