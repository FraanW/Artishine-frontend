// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import InstagramWidget from '../components/InstagramWidget';
import LightWidget from "../components/LightWidget";
import MapWidgetInteractive from '../components/MapWidgetInteractive';
import LottieBackground from '../components/LottieBackground';


// --- This path is corrected to '..' ---
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage = () => {
  const navigate = useNavigate();

  // Load the dotlottie web component script once (kept for previous usage if needed)
  useEffect(() => {
    const scriptSrc = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js';
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const s = document.createElement('script');
      s.src = scriptSrc;
      s.type = 'module';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // Smooth scroll to Instagram section
  const scrollToInstagram = () => {
    const el = document.getElementById('instagram-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '#instagram-section';
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated site background */}
      <AnimatedBackground />

    {/* --- Responsive Navigation (replace your existing nav) --- */}
<nav className="relative z-20 container mx-auto px-6 py-4">
  <div className="flex items-center justify-between">
    {/* Brand: left corner, responsive size */}
    <div className="flex-shrink-0">
      <div
        className="text-2xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-900"
        data-cursor="pointer"
        aria-label="Artishine Home"
      >
        Artishine
      </div>
    </div>

    {/* Buttons: right corner, responsive sizing */}
    <div className="flex items-center gap-3">
      {/* Sign In */}
      <button
        onClick={() => window.location.href = '/login'}
        aria-label="Sign in"
        className="inline-flex items-center justify-center text-sm md:text-lg px-3 py-1.5 md:px-5 md:py-2.5 font-semibold text-amber-900 hover:text-amber-700 transition-colors border-2 border-amber-800 rounded-lg hover:bg-amber-50/50"
        data-cursor="pointer"
      >
        Sign In
      </button>

      {/* Join Now */}
      <button
        onClick={() => window.location.href = '/register'}
        aria-label="Join Artishine"
        className="inline-flex items-center justify-center text-sm md:text-lg px-3 py-1.5 md:px-5 md:py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-medium rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all shadow-lg"
        data-cursor="pointer"
      >
        Join Now
      </button>
    </div>
  </div>
</nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-900 to-amber-700 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Handcrafted Treasures from Artisans Near You
          </motion.h1>

          <motion.p
            className="text-xl font-extrabold text-amber-900/90 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connect with skilled artisans and explore unique, handmade products that tell a story.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-lg font-semibold rounded-full hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              data-cursor="pointer"
            >
              Explore Crafts
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 text-amber-900 border-2 border-amber-800 text-lg font-semibold rounded-full hover:bg-amber-50/50"
              data-cursor="pointer"
            >
              Meet Artisans
            </button>
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-amber-900 mb-16">
            Why Choose Artishine?
          </h2>

          {/* Auto-Publish Instagram Feature */}
          <motion.div
            className="max-w-4xl mx-auto mb-10 p-6 md:p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 text-amber-900"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Instagram icon from lucide-react */}
              <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-amber-100">
                <Instagram size={28} className="text-amber-800" />
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-amber-800 mb-2">
                  Auto-Publish to Instagram
                </h3>
                <p className="text-amber-900/85 leading-relaxed">
                  Upload your product to Artishine and share it with the world — in one click we’ll post the product to our Instagram
                  handle. Each post includes your photos, caption and a link back to the product page so shoppers can discover
                  and buy your handcrafted work instantly.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm font-medium border border-amber-100">
                    One-click publishing
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm font-medium border border-amber-100">
                    Global exposure
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm font-medium border border-amber-100">
                    Link to product
                  </span>
                </div>

                {/* CTA button: scroll to Instagram section */}
                <div className="mt-5">
                  <button
                    onClick={scrollToInstagram}
                    className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold rounded-full shadow-md hover:scale-[1.01] transition-transform"
                    data-cursor="pointer"
                    aria-label="Discover Artisans on Instagram"
                  >
                    <span className="text-lg">📷</span>
                    <span>Discover Artisans on Instagram</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        {/* Crafted Stories in Every Language (centered Lottie animation below text) */}
<motion.div
  className="relative overflow-hidden rounded-2xl shadow-lg border border-amber-100 mb-12 max-w-4xl mx-auto"
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <div className="relative z-10 bg-white/60 backdrop-blur-sm p-6 md:p-10">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="w-20 h-20 rounded-lg bg-amber-100 flex items-center justify-center text-3xl">
        🗣️
      </div>

      <div className="flex-1 text-left">
        <h3 className="text-xl md:text-2xl font-semibold text-amber-800 mb-2">
          Crafted Stories in Every Language
        </h3>

        <p className="text-amber-900/85 leading-relaxed mb-4">
          Artisans can generate authentic product stories in their native language with one click.
          Each story reflects their unique culture and voice — perfect for sharing across Instagram,
          Artishine, and beyond to connect with a global audience.
        </p>
      </div>
    </div>

    {/* --- Centered Lottie animation below description --- */}
    <div className="mt-6 flex justify-center">
      <div className="w-full md:w-4/5 lg:w-3/4">
        <LottieBackground
          src="https://lottie.host/embed/2da1e2bf-a181-43c7-840f-a1d3fd455911/SoeoKiW9eK.lottie"
          inline
          height={360}
          title="Crafted Stories Animation"
          className="rounded-xl shadow-md"
        />
      </div>
    </div>

    {/* --- Feature badges below animation --- */}
    <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
      <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm font-medium border border-amber-100">
        Native language support
      </span>
      <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm font-medium border border-amber-100">
        One-click publish
      </span>
      <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-sm font-medium border border-amber-100">
        Editable preview
      </span>
    </div>
  </div>
</motion.div>


          {/* Discover Artisans on Map feature card */}
          <motion.div
            className="max-w-4xl mx-auto mb-10 p-6 md:p-8 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-100 text-amber-900"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-amber-100 text-3xl">
                🗺️
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-xl md:text-2xl font-semibold text-amber-800 mb-2">
                  Discover Artisans on the Map
                </h3>
                <p className="text-amber-900/85 leading-relaxed">
                  Integrated map view to find artisan shops near you. See artisan locations, get directions, and discover local
                  makers in your neighborhood — all from one place.
                </p>

                <div className="mt-4">
                  <MapWidgetInteractive
                    center={{ lat: 13.0827, lng: 80.2707 }}    // set default center (Chennai)
                    zoom={11}
                    mapHeight={320}
                    mapMaxWidth={900}
                  />

                  <div className="mt-3 text-sm text-amber-700">
                    Login to View the Artisan's Product and Shop Location & Connect with the Artisan.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🖌️',
                title: 'Authentic Handmade',
                description: 'Each piece is carefully crafted by skilled artisans with traditional techniques.'
              },
              {
                icon: '🌍',
                title: 'Local and Global Reach',
                description: 'Discover unique crafts from artisans around the world, all in one place.'
              },
              {
                icon: '💫',
                title: 'Support Local',
                description: 'Your purchase directly supports independent artisans and their communities.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                data-cursor="pointer"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-amber-800 mb-3">{feature.title}</h3>
                <p className="text-amber-900/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section id="instagram-section" className="relative z-10 py-20 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">
              Follow Us on Instagram
            </h2>
            <p className="text-amber-800 mb-6 max-w-2xl mx-auto">
              Explore our latest handcrafted creations and artisan stories. Stay inspired by our community!
            </p>
            <LightWidget />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-amber-900/90 text-amber-100 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">Artishine</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-amber-300 transition-colors">About</a>
              <a href="#" className="hover:text-amber-300 transition-colors">Contact</a>
              <a href="#" className="hover:text-amber-300 transition-colors">FAQ</a>
              <a href="#" className="hover:text-amber-3Openingm-colors">Terms</a>
            </div>
          </div>
          <div className="border-t border-amber-800 mt-8 pt-8 text-center md:text-left">
            <p>© {new Date().getFullYear()} Artishine. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
