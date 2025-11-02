
import React from 'react';
import Navigation from '../../components/Navigation';
import { Clock, Sparkles } from 'lucide-react';

// --- 1. IMPORT THE CANVAS BACKGROUND ---
import CanvasBackground from '../../components/CanvasBackground';

const OrdersDashboardPage = () => {
  return (
    // --- 2. ADD 'relative' TO THE MAIN WRAPPER ---
    <div className="min-h-screen pb-20 pt-32 relative">

      {/* --- 3. ADD THE CANVAS BACKGROUND WITH YOUR COLORS --- */}
      <CanvasBackground
        backgroundColor="#f9feffff" // Using the light color you requested
        elementColors={['#ff620062', '#005cdc5a']} // Using the element colors you requested
      />

      {/* --- 4. ADD 'relative z-10' TO YOUR CONTENT WRAPPER --- */}
      <div className="p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            {/* --- 5. TEXT COLORS UPDATED FOR LIGHT BACKGROUND --- */}
            <h1 className="text-3xl font-serif font-bold mb-2 text-amber-900">Orders Dashboard</h1>
            <p className="text-amber-700 font-semibold">Manage your incoming orders</p>
          </div>

          {/* Coming Soon Section */}
          <div className="text-center py-20 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl shadow-lg border border-amber-200/50">
            <div className="mb-6">
              <Clock className="h-20 w-20 text-amber-600 mx-auto mb-4" />
              <Sparkles className="h-8 w-8 text-amber-500 mx-auto animate-pulse" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4 text-amber-900">Coming Soon</h2>
            <h3 className="text-2xl font-semibold mb-6 text-amber-800">Future Scope: Under Development</h3>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">
              We're working hard to bring you a comprehensive order management system.
              This feature will allow you to track orders, manage deliveries, and communicate
              directly with your customers. Stay tuned for updates!
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                <Clock className="h-5 w-5" />
                In Development
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation userRole="artisan" />
    </div>
  );
};

export default OrdersDashboardPage;
