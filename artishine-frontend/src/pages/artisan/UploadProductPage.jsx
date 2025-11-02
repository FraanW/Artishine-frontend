// src/pages/artisan/UploadProductPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Mic, MicOff, Upload, Instagram } from "lucide-react";
import ImageUploader from "../../components/ImageUploader";
import PrimaryButton from "../../components/PrimaryButton";
import Navigation from "../../components/Navigation";
import CanvasBackground from "../../components/CanvasBackground";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const UploadProductPage = () => {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "artisan") {
      toast.error("Please login as an artisan");
      navigate("/login");
    }
  }, [navigate]);

  const [step, setStep] = useState(1);
  const [imageFiles, setImageFiles] = useState([]); // File objects
  const [audioFile, setAudioFile] = useState(null); // File object
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [postToInstagram, setPostToInstagram] = useState(false);

  // --- ADDED ---
  // New state to manage the final publish button's loading
  const [isPublishing, setIsPublishing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Image select
  const handleImageSelect = (files) => {
    setImageFiles(files);
  };

  // --- MP3 RECORDING (real File object) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "voice_story.mp3", { type: "audio/mpeg" });
        setAudioFile(file);
        stream.getTracks().forEach(t => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      toast.info("Recording...");
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // --- GENERATE STORY (EXACT CURL MATCH) ---
  const generateStory = async () => {
    if (imageFiles.length === 0 || !audioFile) {
      toast.error("Please add image and record audio");
      return;
    }

    setIsUploading(true);
    const form = new FormData();

    // Append images (exact field name)
    imageFiles.forEach(file => form.append("images", file));

    // Append voice file
    form.append("voice_file", audioFile);

    // --- MODIFIED ---
    // We hardcode 'false' here because this step ONLY creates the product.
    // The user decides to post in the *next* step.
    form.append("post_to_instagram", "false");

    try {
      const { data } = await api.post("/products/create-product", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setGenerated(data);
      setStep(4);
      toast.success("Product created!");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || "Upload failed";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen pb-20 pt-20 relative">
      <CanvasBackground backgroundColor="#f9feffff" elementColors={["#ff620062", "#005cdc5a"]} />
      <ToastContainer />

      <div className="p-6 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 text-amber-900">
          Share Your Craft
        </h1>

        {/* STEP 1: Images */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Step 1: Add Photos</h2>
            <ImageUploader onImageSelect={handleImageSelect} previews={imageFiles.map(f => URL.createObjectURL(f))} />
            {imageFiles.length > 0 && (
              <PrimaryButton onClick={() => setStep(2)} className="w-full" size="lg">
                Next
              </PrimaryButton>
            )}
          </div>
        )}

        {/* STEP 2: Record Audio */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Step 2: Record Story</h2>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium ${
                  isRecording ? "bg-red-500 text-white" : "bg-amber-500 text-white"
                }`}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                <span>{isRecording ? "Stop" : "Start"} Recording</span>
              </button>
              {audioFile && <audio controls src={URL.createObjectURL(audioFile)} className="w-full max-w-xs" />}
            </div>
            <PrimaryButton
              onClick={() => setStep(3)}
              className="w-full"
              size="lg"
              disabled={!audioFile}
            >
              Next – Generate Story
            </PrimaryButton>
          </div>
        )}

        {/* STEP 3: Upload */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-serif font-bold text-amber-900">Step 3: Create Product</h2>
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <p>Uploading...</p>
              </div>
            ) : (
              <PrimaryButton onClick={generateStory} size="lg" icon={<Upload className="h-5 w-5" />}>
                Create Product
              </PrimaryButton>
            )}
          </div>
        )}

        {step === 4 && generated && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-serif font-bold mb-2 text-amber-900">
                Your Story is Ready!
              </h2>
              <p className="text-amber-700 font-semibold">Review before publishing</p>
            </div>

            {/* Product Image Preview */}
            {generated.image_urls?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-amber-900 mb-2">Product Image</p>
                <img
                  src={generated.image_urls[0]}
                  alt={generated.story?.Title}
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* Story Fields */}
            <div className="space-y-5">
              {[
                { label: "Title", value: generated.story?.Title },
                { label: "Tagline", value: generated.story?.Tagline },
                { label: "Category", value: generated.story?.Category },
                { label: "For Whom", value: generated.story?.ForWhom },
                { label: "Material", value: generated.story?.Material },
                { label: "Method", value: generated.story?.Method },
                { label: "Cultural Significance", value: generated.story?.CulturalSignificance },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="text-amber-900 leading-relaxed">
                    {value || "—"}
                  </p>
                </div>
              ))}

              {/* Artisan Info */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-lg border border-amber-300">
                <p className="text-sm font-semibold text-amber-800 mb-2">Created By</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-amber-800">
                      {generated.story?.WhoMadeIt?.Name?.[0] || "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-amber-900">
                      {generated.story?.WhoMadeIt?.Name}
                    </p>
                    <p className="text-sm text-amber-700">
                      {generated.story?.WhoMadeIt?.["Shop Name"]} • {generated.story?.WhoMadeIt?.Location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram Toggle */}
            <div className="flex items-center justify-between p-4 bg-white/70 rounded-lg border border-amber-300">
              <div className="flex items-center space-x-3">
                <Instagram className="h-6 w-6 text-pink-600" />
                <div>
                  <p className="font-medium text-amber-900">Auto-post to Instagram</p>
                  <p className="text-xs text-amber-700">Share your story instantly</p>
                </div>
              </div>
              <button
                onClick={() => setPostToInstagram(!postToInstagram)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  postToInstagram ? "bg-pink-500" : "bg-gray-300"
                }`}
                aria-pressed={postToInstagram}
                aria-label="Toggle auto post to Instagram"
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    postToInstagram ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* --- MODIFIED: Publish Button --- */}
            <PrimaryButton
              onClick={async () => {
                setIsPublishing(true); // Start loading
                
                try {
                  if (postToInstagram) {
                    toast.info("Posting to Instagram...");
                    // Call the new endpoint
                    await api.post(
                      `/products/${generated.user_id}/${generated.product_id}/post-to-instagram`
                    );
                    toast.success("Product published and posted to Instagram!");
                  } else {
                    toast.success("Product published to your shop!");
                  }

                  // Navigate away on success
                  setTimeout(() => navigate("/manage-products"), 1500);

                } catch (err) {
                  console.error(err);
                  const msg = err.response?.data?.detail || "Post failed";
                  toast.error(msg);
                  setIsPublishing(false); // Stop loading on error
                }
              }}
              size="lg"
              className="w-full text-lg py-4"
              icon={isPublishing ? (
                <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Sparkles className="h-6 w-6" />
              )}
              disabled={isPublishing}
            >
              {isPublishing ? "Publishing..." : "Publish Product"}
            </PrimaryButton>
          </div>
        )}
      </div>

      <Navigation userRole="artisan" />
    </div>
  );
};

export default UploadProductPage;
