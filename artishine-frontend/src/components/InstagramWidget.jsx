import React, { useEffect } from 'react';

const InstagramWidget = () => {
  useEffect(() => {
    // Ensure the Elfsight script loads only once
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-12">
      {/* This div is from Elfsight — replace with your own app ID */}
      <div
        className="elfsight-app-602eb2bd-8895-4a13-b281-df0ae27f10b9"
        data-elfsight-app-lazy
        style={{ width: '100%', maxWidth: '1000px' }}
      />
    </div>
  );
};

export default InstagramWidget;
