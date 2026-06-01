import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LeafletMap } from "../components/ui/LeafletMap";
import { getActiveServices } from "../api/serviceApi";
import { FeedbackModal } from "../components/ui/FeedbackModal";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import { 
  HiOutlineSearch, 
  HiOutlineLocationMarker, 
  HiOutlineChatAlt, 
  HiOutlineSparkles,
  HiOutlineViewGrid
} from 'react-icons/hi';

const ServiceSearch = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    latitude: "27.7172",
    longitude: "85.3240",
    problemDescription: "",
  });

  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const { feedback, close, showWarning } = useFeedbackModal();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getActiveServices();
        setCategories(
          (res.data.categories || []).map((cat) => ({
            id: cat.name,
            name: cat.label,
          }))
        );
      } catch {
        setError("Failed to load service categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.category || !formData.latitude || !formData.longitude) {
      setError("Category and location are required");
      return;
    }

    const params = new URLSearchParams({
      category: formData.category,
      latitude: formData.latitude,
      longitude: formData.longitude,
      problemDescription: formData.problemDescription,
    });

    navigate(`/recommendations?${params.toString()}`);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showWarning(
        "Location unavailable",
        "Geolocation is not supported by your browser."
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      () => {
        showWarning(
          "Location access denied",
          "Please enable location access in your browser settings and try again."
        );
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
          <HiOutlineSparkles size={14} />
          AI-Powered Search
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
          Find Your <span className="text-emerald-500">Expert.</span>
        </h1>
        <p className="text-lg font-bold text-slate-400 dark:text-slate-500 max-w-xl mx-auto">
          Tell us what's wrong, and our smart engine will find the best service provider for your location.
        </p>
      </div>

      <Card className="!rounded-[3rem] shadow-2xl shadow-emerald-500/5">
        <CardBody className="p-8 md:p-12">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSearch} className="space-y-10">
            {/* Row 1: Category + Problem Description side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Category Picker */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <HiOutlineViewGrid size={16} className="text-emerald-500" />
                  Service Type
                </label>
                <div className="relative group">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="">
                      {loadingCategories ? "Loading services..." : "Choose category..."}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <HiOutlineSparkles size={20} />
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <HiOutlineChatAlt size={16} className="text-emerald-500" />
                  Describe the Issue (Optional)
                </label>
                <textarea
                  name="problemDescription"
                  placeholder="Example: My kitchen tap has been leaking since yesterday..."
                  value={formData.problemDescription}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Row 2: Full-width interactive map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <HiOutlineLocationMarker size={16} className="text-emerald-500" />
                  Pin Your Location
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  className="text-xs font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest hover:underline flex items-center gap-1.5 focus:outline-none transition-all group"
                >
                  <HiOutlineLocationMarker className="group-hover:scale-125 transition-transform" size={14} />
                  Use My Location
                </button>
              </div>

              {/* Map */}
              <div
                className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner"
                style={{ height: "340px" }}
              >
                <LeafletMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onChange={(lat, lng) =>
                    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                  }
                />
              </div>

              {/* Coordinate readout */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <HiOutlineLocationMarker className="text-emerald-500 flex-shrink-0" size={18} />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="text-slate-800 dark:text-white font-black">{Number(formData.latitude).toFixed(4)}°N</span>
                  {' · '}
                  <span className="text-slate-800 dark:text-white font-black">{Number(formData.longitude).toFixed(4)}°E</span>
                  <span className="ml-2 text-slate-400">— Click the map or drag the pin to set your location</span>
                </p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full py-6 rounded-[2rem] text-xl group"
            >
              <HiOutlineSearch size={24} className="mr-3 group-hover:scale-125 transition-transform" />
              Discover Recommendations
            </Button>
          </form>
        </CardBody>
      </Card>
      <FeedbackModal
        isOpen={feedback.open}
        onClose={close}
        variant={feedback.variant}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
      />
    </div>
  );
};

export default ServiceSearch;