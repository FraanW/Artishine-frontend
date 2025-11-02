import React, { useEffect } from "react";

const LightWidget = () => {
  useEffect(() => {
    // Load the LightWidget script dynamically (once)
    if (!document.querySelector('script[src="https://cdn.lightwidget.com/widgets/lightwidget.js"]')) {
      const script = document.createElement("script");
      script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center my-12">
  <div style={{ width: "80%", maxWidth: "800px" }}>
    <iframe
      title="Instagram Feed"
      src="https://cdn.lightwidget.com/widgets/47fc1b034de359e79c795edcda6ad77a.html"
      scrolling="no"
      allowTransparency="true"
      className="lightwidget-widget"
      style={{
        width: "100%",
        height: "400px",
        border: 0,
        overflow: "hidden",
      }}
    ></iframe>
  </div>
</div>

  );
};

export default LightWidget;
