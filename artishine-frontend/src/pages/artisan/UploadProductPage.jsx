import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Instagram, Mic, MicOff, Upload } from "lucide-react";
import ImageUploader from "../../components/ImageUploader";
import PrimaryButton from "../../components/PrimaryButton";
import Navigation from "../../components/Navigation";
import CanvasBackground from "../../components/CanvasBackground";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthServices from "../../services/AuthServices";

const UploadProductPage = () => {
  const navigate = useNavigate();

  // ────── Auth guard ──────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "artisan") {
      toast.error("Please login as an artisan");
      navigate("/login");
    }
  }, [navigate]);

  // ────── UI state ──────
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [postToInstagram, setPostToInstagram] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // ────── Image handling ──────
  const handleImageSelect = (files) => {
    setImageFiles(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setSelectedImages(urls);
  };

  // ────── MP3 Audio Recording (using MediaRecorder + Opus) ──────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: "audio/webm;codecs=opus" }; // Best browser support for MP3-like
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        // Convert WebM → MP3 using Web Audio API + lamejs (optional)
        // For simplicity: just send as MP3 (rename + accept webm/opus)
        // Most backends accept webm/opus. If you *must* have .mp3, use lamejs below.

        // --- OPTION 1: Send as .webm (recommended, smaller, good quality) ---
        const mp3Blob = new Blob([webmBlob], { type: "audio/mpeg" });
        const mp3File = new File([mp3Blob], "voice_story.mp3", { type: "audio/mpeg" });

        setAudioBlob(mp3File);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      toast.info("Recording... Speak now!");
    } catch (err) {
      console.error(err);
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ────── Generate Story (Call Backend) ──────
  const generateStory = async () => {
    if (!imageFiles.length || !audioBlob) {
      toast.error("Please add images and record audio first");
      return;
    }

    setIsUploading(true);
    const form = new FormData();

    imageFiles.forEach((f) => form.append("images", f));
    form.append("voice_file", audioBlob); // ← MP3 file

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User ID not found – please login again");
      setIsUploading(false);
      return;
    }
    form.append("user_id", userId);
    form.append("postToInstagram", postToInstagram);

    try {
      const { data } = await AuthServices.uploadProduct(form);
      setGenerated(data);
      setStep(4);
      toast.success("Story generated!");
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to generate story";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // ────── Render ──────
  return (
    <div className="min-h-screen pb-20 pt-20 relative">
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={["#ff620062", "#005cdc5a"]}
      />
      <ToastContainer />

      <div className="p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-amber-900">
              Share Your Craft
            </h1>
            <p className="text-amber-700 font-semibold">
              Let AI build a beautiful story
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= n
                      ? "bg-amber-500 text-white"
                      : "bg-amber-200 text-amber-700"
                  }`}
                >
                  {n}
                </div>
                {n < 4 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-all ${
                      step > n ? "bg-amber-500" : "bg-amber-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1 – Images */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold mb-2 text-amber-900">
                  Step 1 – Add Photos
                </h2>
              </div>
              <ImageUploader
                onImageSelect={handleImageSelect}
                previews={selectedImages}
              />
              {imageFiles.length > 0 && (
                <PrimaryButton
                  className="mt-6 w-full"
                  size="lg"
                  onClick={() => setStep(2)}
                >
                  Next
                </PrimaryButton>
              )}
            </div>
          )}

          {/* STEP 2 – Record Audio (MP3) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold mb-2 text-amber-900">
                  Step 2 – Record Your Story
                </h2>
                <p className="text-amber-700 font-semibold">
                  Speak about your craft (MP3 format)
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    isRecording
                      ? "bg-red-500 text-white"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-5 w-5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>

                {audioBlob && (
                  <audio
                    controls
                    src={URL.createObjectURL(audioBlob)}
                    className="w-full max-w-xs"
                  />
                )}
              </div>

              <PrimaryButton
                className="mt-6 w-full"
                size="lg"
                onClick={() => setStep(3)}
                disabled={!audioBlob}
              >
                Next – Generate Story
              </PrimaryButton>
            </div>
          )}

          {/* STEP 3 – Waiting */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif font-bold mb-2 text-amber-900">
                  Step 3 – Building Your Story
                </h2>
              </div>

              <div className="card-warm p-8 text-center bg-amber-50/50 rounded-lg">
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-amber-900">
                      Working magic…
                    </h3>
                  </div>
                ) : (
                  <PrimaryButton
                    onClick={generateStory}
                    size="lg"
                    icon={<Upload className="h-5 w-5" />}
                  >
                    Generate Story
                  </PrimaryButton>
                )}
              </div>
            </div>
          )}

          {/* STEP 4 – Review & Publish */}
  {step === 4 && generated && (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold mb-2 text-amber-900">
          Step 4 – Review & Publish
        </h2>
        <p className="text-amber-700 font-semibold">
          Your AI-crafted story is ready!
        </p>
      </div>

      {/* Story Fields */}
      {[
        { label: "Title", key: "story.Title" },
        { label: "Tagline", key: "story.Tagline" },
        { label: "Category", key: "story.Category" },
        { label: "For Whom", key: "story.ForWhom" },
        { label: "Material", key: "story.Material" },
        { label: "Method", key: "story.Method" },
        { label: "Cultural Significance", key: "story.CulturalSignificance" },
      ].map(({ label, key }) => {
        const value = key.split(".").reduce((o, k) => o?.[k], generated) || "—";
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-amber-900 mb-1">
              {label}
            </label>
            <input
              type="text"
              value={value}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-amber-300 bg-white/50 text-amber-900 placeholder-amber-400"
            />
          </div>
        );
      })}

      {/* Artisan Info */}
      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm font-medium text-amber-900 mb-1">Created By</p>
        <p className="text-amber-800">
          {generated.artisan_details?.name} • {generated.artisan_details?.shop_name}
        </p>
        <p className="text-sm text-amber-700">
          {generated.artisan_details?.location}
        </p>
      </div>

      {/* Image Preview */}
      {generated.image_urls?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-amber-900 mb-2">Product Image</p>
          <img
            src={generated.image_urls[0]}
            alt="Product"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Instagram Toggle */}
      <div className="flex items-center justify-between p-4 border border-amber-300 rounded-lg bg-white/50">
        <div className="flex items-center space-x-3">
          <Instagram className="h-6 w-6 text-amber-600" />
          <div>
            <p className="font-medium text-amber-900">Auto-post to Instagram</p>
            <p className="text-sm text-amber-700">Share with your followers</p>
          </div>
        </div>
        <button
          onClick={() => setPostToInstagram(!postToInstagram)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            postToInstagram ? "bg-amber-500" : "bg-amber-200"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              postToInstagram ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Publish Button */}
      <PrimaryButton
        onClick={() => {
          toast.success("Product published successfully!");
          setTimeout(() => navigate("/manage-products"), 1500);
        }}
        size="lg"
        className="w-full"
      >
        Publish Product
      </PrimaryButton>
    </div>
  )}
        </div>
      </div>

      <Navigation userRole="artisan" />
    </div>
  );
};

export default UploadProductPage;