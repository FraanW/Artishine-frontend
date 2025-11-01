// src/pages/artisan/ManageProductsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit3,
  Trash2,
} from "lucide-react";
import PrimaryButton from "../../components/PrimaryButton";
import Navigation from "../../components/Navigation";
import CanvasBackground from "../../components/CanvasBackground";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductServices from "../../services/ProductServices";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  // Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Undo delete (client-side)
  const [lastDeleted, setLastDeleted] = useState(null);

  const navigate = useNavigate();

  /* ────── AUTH GUARD ────── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "artisan") {
      toast.error("Please login as an artisan");
      navigate("/login");
    }
  }, [navigate]);

  /* ────── FETCH PRODUCTS ────── */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductServices.getUserProducts();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ────── DELETE ────── */
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeletingId(productId);
      await ProductServices.deleteProduct(productId);

      // Store for undo
      const idx = products.findIndex(
        (p) => (p.product_id || p.id || p.productId) === productId
      );
      const deleted = products[idx];
      setLastDeleted({ product: deleted, index: idx });

      // Remove from UI
      setProducts((prev) =>
        prev.filter((p) => (p.product_id || p.id || p.productId) !== productId)
      );

      // Close modal if open
      if (
        selectedProduct &&
        (selectedProduct.product_id || selectedProduct.id) === productId
      ) {
        setSelectedProduct(null);
        setEditingProduct(null);
      }

      toast.success(
        <div className="flex items-center space-x-2">
          <span>Product deleted</span>
          <button
            onClick={handleUndoDelete}
            className="underline text-white hover:text-amber-200 font-medium"
          >
            Undo
          </button>
        </div>,
        { autoClose: 5000 }
      );
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ────── UNDO DELETE (client-side) ────── */
  const handleUndoDelete = () => {
    if (!lastDeleted) return;
    const { product, index } = lastDeleted;
    const copy = [...products];
    copy.splice(index, 0, product);
    setProducts(copy);
    setLastDeleted(null);
    toast.info("Product restored");
  };

  /* ────── EDIT → SAVE ────── */
  const startEdit = () => setEditingProduct({ ...selectedProduct });
  const cancelEdit = () => setEditingProduct(null);

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    const productId =
      editingProduct.product_id || editingProduct.id || editingProduct.productId;

    // Build **flat** payload (backend expects this)
    const updates = {
      Title: editingProduct.story?.Title?.trim(),
      Tagline: editingProduct.story?.Tagline?.trim(),
      Category: editingProduct.story?.Category?.trim(),
      Material: editingProduct.story?.Material?.trim(),
      Method: editingProduct.story?.Method?.trim(),
      ForWhom: editingProduct.story?.ForWhom?.trim(),
    };

    // Remove empty fields
    Object.keys(updates).forEach((k) => {
      if (!updates[k]) delete updates[k];
    });

    if (Object.keys(updates).length === 0) {
      toast.error("No changes to save");
      return;
    }

    try {
      setSavingId(productId);
      const updated = await ProductServices.updateProduct(productId, updates);

      // Update UI
      setProducts((prev) =>
        prev.map((p) =>
          (p.product_id || p.id || p.productId) === productId
            ? { ...p, story: { ...p.story, ...updates } }
            : p
        )
      );

      setSelectedProduct((prev) =>
        (prev?.product_id || prev?.id) === productId
          ? { ...prev, story: { ...prev.story, ...updates } }
          : prev
      );

      setEditingProduct(null);
      toast.success("Product updated!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.detail || "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  /* ────── HELPERS ────── */
  const openProduct = (p) => setSelectedProduct(p);
  const closeProduct = () => {
    setSelectedProduct(null);
    setEditingProduct(null);
  };

  const formatDateToIST = (iso) =>
    iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Kolkata" }) : "—";

  /* ────── LOADING UI ────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <CanvasBackground
          backgroundColor="#f9feffff"
          elementColors={["#ff620062", "#005cdc5a"]}
        />
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-900 font-semibold">Loading your products…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-20 relative">
      <CanvasBackground
        backgroundColor="#f9feffff"
        elementColors={["#ff620062", "#005cdc5a"]}
      />
      <ToastContainer />

      <div className="p-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2 text-amber-900">
                My Products ({products.length})
              </h1>
              <p className="text-amber-700 font-semibold">
                Manage your digital storefront
              </p>
            </div>
            <PrimaryButton
              onClick={() => navigate("/upload")}
              icon={<Plus className="h-5 w-5" />}
            >
              Add Product
            </PrimaryButton>
          </div>

          {/* Empty state */}
          {products.length === 0 ? (
            <div className="text-center py-20 bg-amber-50/50 rounded-2xl p-12">
              <div className="w-24 h-24 bg-amber-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Plus className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-2 text-amber-900">
                No products yet
              </h2>
              <p className="text-amber-700 mb-6">
                Create your first masterpiece and share it with the world
              </p>
              <PrimaryButton
                onClick={() => navigate("/upload")}
                size="lg"
                icon={<Plus className="h-5 w-5" />}
              >
                Create First Product
              </PrimaryButton>
            </div>
          ) : (
            /* Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => {
                const pid = product.product_id || product.productId || product.id;
                return (
                  <article
                    key={pid}
                    className="group cursor-pointer"
                    onClick={() => openProduct(product)}
                  >
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      {/* Image */}
                      <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200 relative overflow-hidden">
                        {product.image_urls?.[0] ? (
                          <img
                            src={product.image_urls[0]}
                            alt={product.story?.Title || "Product"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-amber-500">
                            <Plus className="h-16 w-16" />
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div className="p-4">
                        <h3 className="font-serif text-lg font-bold text-amber-900 truncate">
                          {product.story?.Title || "Untitled"}
                        </h3>
                        <p className="text-sm text-amber-700 line-clamp-2">
                          {product.story?.Tagline || "No tagline"}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-amber-600">
                            {product.story?.Category || "—"}
                          </span>
                          <div className="flex space-x-1">
                            {/* Edit */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit();
                                openProduct(product);
                              }}
                              className="p-1 text-amber-700 hover:bg-amber-100 rounded"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(pid);
                              }}
                              disabled={deletingId === pid}
                              className="p-1 text-red-600 hover:bg-red-100 rounded disabled:opacity-50"
                            >
                              {deletingId === pid ? (
                                <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ────── MODAL ────── */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-amber-900">
                  {editingProduct
                    ? "Edit Product"
                    : selectedProduct.story?.Title || "Untitled"}
                </h2>
                {editingProduct && (
                  <p className="text-sm text-amber-700 mt-1">
                    Make changes and click Save
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {editingProduct ? (
                  <>
                    <PrimaryButton
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={savingId === (selectedProduct.product_id || selectedProduct.id)}
                      loading={savingId === (selectedProduct.product_id || selectedProduct.id)}
                    >
                      Save
                    </PrimaryButton>
                    <PrimaryButton variant="outline" size="sm" onClick={cancelEdit}>
                      Cancel
                    </PrimaryButton>
                  </>
                ) : (
                  <>
                    <PrimaryButton
                      variant="outline"
                      size="sm"
                      onClick={startEdit}
                      icon={<Edit3 className="h-4 w-4" />}
                    >
                      Edit
                    </PrimaryButton>
                    <PrimaryButton
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleDelete(selectedProduct.product_id || selectedProduct.id)
                      }
                      icon={<Trash2 className="h-4 w-4" />}
                      disabled={deletingId === (selectedProduct.product_id || selectedProduct.id)}
                      loading={deletingId === (selectedProduct.product_id || selectedProduct.id)}
                    >
                      {deletingId === (selectedProduct.product_id || selectedProduct.id)
                        ? "Deleting..."
                        : "Delete"}
                    </PrimaryButton>
                  </>
                )}
                <button
                  onClick={closeProduct}
                  className="ml-2 text-amber-700 underline text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Images */}
              <div>
                {selectedProduct.image_urls?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedProduct.image_urls.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${selectedProduct.story?.Title || "Product"} ${i + 1}`}
                        className="w-full h-80 object-contain rounded-lg bg-amber-50"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full h-80 flex items-center justify-center bg-amber-50 rounded-lg">
                    <Plus className="h-12 w-12 text-amber-400" />
                  </div>
                )}
              </div>

              {/* Form / Details */}
              <div className="space-y-4">
                {[
                  { label: "Title", key: "Title" },
                  { label: "Tagline", key: "Tagline" },
                  { label: "Category", key: "Category" },
                  { label: "Material", key: "Material" },
                  { label: "Method", key: "Method" },
                  { label: "For Whom", key: "ForWhom" },
                ].map(({ label, key }) => (
                  <div
                    key={key}
                    className="bg-white/60 p-4 rounded-lg border border-amber-100"
                  >
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                      {label}
                    </p>
                    {editingProduct ? (
                      <input
                        type="text"
                        value={editingProduct.story?.[key] || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            story: { ...editingProduct.story, [key]: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1 border border-amber-300 rounded-md text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : (
                      <p className="text-amber-900">
                        {selectedProduct.story?.[key] || "—"}
                      </p>
                    )}
                  </div>
                ))}

                {/* Cultural Significance (read-only) */}
                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                    Cultural Significance
                  </p>
                  <p className="text-amber-900 whitespace-pre-line">
                    {selectedProduct.story?.CulturalSignificance || "—"}
                  </p>
                </div>

                {/* Artisan */}
                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                    Artisan
                  </p>
                  <p className="text-amber-900 font-medium">
                    {selectedProduct.artisan_details?.name ||
                      selectedProduct.story?.WhoMadeIt?.Name ||
                      "—"}
                  </p>
                  <p className="text-sm text-amber-700">
                    {selectedProduct.artisan_details?.shop_name ||
                      selectedProduct.story?.WhoMadeIt?.["Shop Name"] ||
                      ""}
                    {selectedProduct.artisan_details?.location
                      ? ` • ${selectedProduct.artisan_details.location}`
                      : ""}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                  <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                    Created
                  </p>
                  <p className="text-amber-900">
                    {formatDateToIST(selectedProduct.timestamp)}
                  </p>
                </div>

                {/* Voice transcript */}
                {(selectedProduct.voice_transcript_english ||
                  selectedProduct.voice_transcript_original) && (
                  <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                      Voice Story
                    </p>
                    <p className="text-amber-900 whitespace-pre-line">
                      {selectedProduct.voice_transcript_english ||
                        selectedProduct.voice_transcript_original}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Full story preview */}
            <div className="mt-6">
              <div className="bg-white/60 p-4 rounded-lg border border-amber-100">
                <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-1">
                  Full Story
                </p>
                <div className="text-amber-900 whitespace-pre-line">
                  <p className="font-semibold mb-2">
                    {selectedProduct.story?.Title}
                  </p>
                  <p className="mb-2">{selectedProduct.story?.Tagline}</p>
                  <p className="text-sm text-amber-700">
                    {selectedProduct.story?.CulturalSignificance}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Navigation userRole="artisan" />
    </div>
  );
};

export default ManageProductsPage;