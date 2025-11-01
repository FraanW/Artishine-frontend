import React, { useState } from 'react';
import sampleData from '../../data/sampleData';
import PrimaryButton from '../../components/PrimaryButton';
import { Instagram, Sparkles, User } from 'lucide-react';
import Navigation from '../../components/Navigation';

const ManageProfilePageArtisan = () => {
  const [profile, setProfile] = useState(sampleData.currentUser);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProfile((prev) => ({
      ...prev,
      bio:
        'Master potter with three decades of experience, Meera Devi transforms humble clay into extraordinary art. Her work bridges ancient traditions with contemporary aesthetics, creating pieces that tell stories of heritage and innovation. Each creation from her studio reflects her deep understanding of ceramic arts and her commitment to preserving traditional craftsmanship for future generations.',
    }));
    setIsGeneratingBio(false);
  };

  return (
    <div className="min-h-screen  pb-20 pt-20">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-white">My Profile</h1>
            <p className="text-muted-foreground">Manage your artisan identity</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-12 w-12 text-primary-foreground" />
              </div>
              <PrimaryButton variant="outline" size="sm">Upload Photo</PrimaryButton>
            </div>

            <div className="card-warm p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shop Name</label>
                <input type="text" value={profile.shopName} onChange={(e) => setProfile((prev) => ({ ...prev, shopName: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input type="text" value={profile.location} onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))} className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">About My Craft</label>
                  <PrimaryButton onClick={handleGenerateBio} disabled={isGeneratingBio} variant="outline" size="sm" icon={<Sparkles className="h-4 w-4" />}>
                    {isGeneratingBio ? 'Generating...' : '✨ Generate Bio'}
                  </PrimaryButton>
                </div>
                <textarea value={profile.bio} onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))} rows={6} className="w-full px-4 py-3 rounded-lg border border-border  focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 resize-none" placeholder="Tell your story..." />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Instagram className="h-6 w-6 text-pink-500" />
                  <div>
                    <p className="font-medium">{profile.isInstagramConnected ? 'Connected to Instagram' : 'Connect Instagram'}</p>
                    <p className="text-sm text-muted-foreground">{profile.isInstagramConnected ? '@clayreamsstudio' : 'Auto-share your products'}</p>
                  </div>
                </div>
                <PrimaryButton variant={profile.isInstagramConnected ? 'wood' : 'terracotta'} size="sm">
                  {profile.isInstagramConnected ? 'Disconnect' : 'Connect'}
                </PrimaryButton>
              </div>

              <PrimaryButton size="lg" className="w-full">Save Changes</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
      <Navigation userRole="artisan" />
    </div>
  );
};

export default ManageProfilePageArtisan;


