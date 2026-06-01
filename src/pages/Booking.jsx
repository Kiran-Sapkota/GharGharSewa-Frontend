import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { createBooking } from "../api/bookingApi";
import { getProviderById } from "../api/providerApi";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { LeafletMap } from "../components/ui/LeafletMap";
import { reverseGeocodeShort } from "../utils/formatAddress";
import { FeedbackModal } from "../components/ui/FeedbackModal";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import {
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineStar,
  HiOutlineCurrencyRupee,
  HiOutlineShieldCheck,
  HiOutlineCalendar,
} from "react-icons/hi";

const formatCategoryLabel = (value) =>
  value
    ? value.replace(/\b\w/g, (c) => c.toUpperCase())
    : "N/A";

const getMinDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const formatScheduledSummary = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const Booking = () => {
  const { providerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(location.state?.provider ?? null);
  const [matchedService, setMatchedService] = useState(
    location.state?.matchedService ?? null
  );
  const [pageLoading, setPageLoading] = useState(
    !location.state?.provider || !location.state?.matchedService
  );

  const serviceCategory = matchedService?.category || "";
  const pricePerHour = matchedService?.price ?? "";

  const [formData, setFormData] = useState({
    serviceDescription: "",
    bookingDate: "",
    address: "",
    latitude: "27.7172",
    longitude: "85.3240",
  });
  const [locating, setLocating] = useState(false);

  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const { feedback, close, showWarning } = useFeedbackModal();

  const minDateTime = useMemo(() => getMinDateTimeLocal(), []);

  useEffect(() => {
    const loadProvider = async () => {
      if (!providerId) return;
      if (provider && matchedService) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        const res = await getProviderById(providerId);
        const p = res.data.provider;
        setProvider(p);
        if (!matchedService && p?.services?.length > 0) {
          setMatchedService(p.services[0]);
        }
      } catch {
        setError("Could not load provider. Please go back and select again.");
      } finally {
        setPageLoading(false);
      }
    };

    loadProvider();
  }, [providerId, provider, matchedService]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMapChange = async (lat, lng) => {
    const address = await reverseGeocodeShort(lat, lng);
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      ...(address ? { address } : {}),
    }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      showWarning(
        "Location unavailable",
        "Geolocation is not supported by your browser."
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const address = await reverseGeocodeShort(lat, lng);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          address: address || prev.address,
        }));
        setLocating(false);
      },
      () => {
        showWarning(
          "Location access denied",
          "Please enable location access in your browser settings and try again."
        );
        setLocating(false);
      }
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!providerId) {
      setError("Provider selection lost. Please go back and select a provider.");
      return;
    }

    if (!serviceCategory || pricePerHour === "") {
      setError("Service details are missing. Please return to recommendations.");
      return;
    }

    if (!formData.bookingDate || !formData.address.trim()) {
      setError("Please fill in all required fields marked with *");
      return;
    }

    const scheduledAt = new Date(formData.bookingDate);
    if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) {
      setError("Please choose a date and time in the future.");
      return;
    }

    const payload = {
      provider: providerId,
      serviceCategory,
      serviceDescription: formData.serviceDescription,
      bookingDate: scheduledAt.toISOString(),
      address: formData.address.trim(),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      totalPrice: Number(pricePerHour),
    };

    try {
      setLoading(true);
      await createBooking(payload);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        navigate("/bookings");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">
          Loading booking details...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 sm:px-6">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
          <HiOutlineShieldCheck size={14} />
          Secure Booking
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
          Finalize Your <span className="text-emerald-500">Request.</span>
        </h1>

        <p className="text-lg font-bold text-slate-400 dark:text-slate-500">
          Confirm your schedule and address. Service and rate are set by your selected provider.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-8 min-w-0">
          <Card className="!rounded-[2.5rem] shadow-2xl shadow-emerald-500/5">
            <CardBody className="p-8 md:p-12">
              {showMessage && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl mb-6 font-bold text-sm">
                  Booking confirmed! We&apos;ve notified the provider. 🚀
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 font-bold text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 min-w-0">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                      Service Type
                    </label>
                    <div className="w-full min-w-0 bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 rounded-2xl font-bold text-slate-700 dark:text-white capitalize truncate">
                      {formatCategoryLabel(serviceCategory)}
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 px-1">
                      Set from your provider selection
                    </p>
                  </div>

                  <div className="space-y-2 min-w-0">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                      Price per hour (Rs.)
                    </label>
                    <div className="relative min-w-0">
                      <HiOutlineCurrencyRupee
                        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <div className="w-full min-w-0 bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 pl-12 sm:pl-14 pr-4 sm:pr-6 py-4 rounded-2xl font-bold text-slate-700 dark:text-white">
                        {pricePerHour || "—"}
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 px-1">
                      Provider rate — cannot be changed here
                    </p>
                  </div>

                  <div className="space-y-2 min-w-0 sm:col-span-2">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <HiOutlineCalendar size={14} className="text-emerald-500" />
                      Schedule date & time *
                    </label>
                    <input
                      type="datetime-local"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleChange}
                      min={minDateTime}
                      required
                      className="w-full min-w-0 max-w-full box-border bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white [color-scheme:dark]"
                    />
                    <p className="text-[10px] font-bold text-slate-400 px-1">
                      Must be after the current date and time
                    </p>
                  </div>
                </div>

                <div className="space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-1">
                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <HiOutlineLocationMarker size={14} className="text-emerald-500" />
                      Service address *
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={locating}
                      className="text-xs font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest hover:underline flex items-center gap-1.5 self-start sm:self-auto disabled:opacity-50"
                    >
                      <HiOutlineLocationMarker size={14} />
                      {locating ? "Locating..." : "Use My Location"}
                    </button>
                  </div>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, City — or pick on the map below"
                    required
                    className="w-full min-w-0 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
                  />

                  <div
                    className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner w-full"
                    style={{ height: "280px" }}
                  >
                    <LeafletMap
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                      onChange={handleMapChange}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <HiOutlineLocationMarker className="text-emerald-500 shrink-0" size={16} />
                    <span className="text-slate-800 dark:text-white font-black">
                      {Number(formData.latitude).toFixed(4)}°N
                    </span>
                    <span>·</span>
                    <span className="text-slate-800 dark:text-white font-black">
                      {Number(formData.longitude).toFixed(4)}°E
                    </span>
                    <span className="text-slate-400 w-full sm:w-auto">
                      — Click map or drag pin to set location
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
                    Task details
                  </label>
                  <textarea
                    name="serviceDescription"
                    value={formData.serviceDescription}
                    onChange={handleChange}
                    placeholder="Provide some details about the work..."
                    rows="4"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-8 py-6 rounded-[2rem] focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white leading-relaxed"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || !serviceCategory}
                    size="lg"
                    className="w-full py-5 rounded-[2rem] text-xl"
                  >
                    {loading ? "Processing..." : "Confirm & Book Now"}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(true)}
                    className="w-full py-5 rounded-[2rem] text-xl font-black bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-all"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 min-w-0 xl:sticky xl:top-8">
          <Card className="!rounded-[2.5rem] bg-emerald-500 text-white border-none shadow-xl shadow-emerald-500/20">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest opacity-80">
                Provider Info
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 bg-white/20 rounded-2xl flex items-center justify-center">
                    <HiOutlineUser size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-xl leading-tight break-words">
                      {provider?.name || "Expert Provider"}
                    </p>
                    <p className="text-sm font-bold opacity-70 break-words">
                      {provider?.location?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
                  <HiOutlineStar size={20} className="text-amber-300" />
                  <span className="font-black">
                    {provider?.rating || 0} / 5 Rating
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="!rounded-[2.5rem] border-slate-100 dark:border-slate-800">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[auto_1fr] sm:gap-x-4 sm:gap-y-1 sm:items-baseline">
                  <span className="font-bold text-slate-500 shrink-0">Service</span>
                  <span className="font-black text-slate-800 dark:text-white uppercase text-sm capitalize break-words sm:text-right">
                    {formatCategoryLabel(serviceCategory)}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1 sm:grid-cols-[auto_1fr] sm:gap-x-4 sm:items-baseline">
                  <span className="font-bold text-slate-500 shrink-0">Rate / hour</span>
                  <div className="font-black text-slate-800 dark:text-white flex items-center gap-1 sm:justify-end">
                    <HiOutlineCurrencyRupee size={18} className="shrink-0" />
                    {pricePerHour || "0"}
                  </div>
                </div>

                {formData.bookingDate && (
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-[auto_1fr] sm:gap-x-4 sm:items-start">
                    <span className="font-bold text-slate-500 shrink-0">Scheduled</span>
                    <span className="font-black text-slate-800 dark:text-white text-sm break-words leading-snug sm:text-right">
                      {formatScheduledSummary(formData.bookingDate)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_1fr] sm:gap-x-4 sm:items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                  <span className="font-bold text-slate-500 text-base sm:text-lg shrink-0">
                    Est. hourly total
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-500 flex items-center gap-1 sm:justify-end">
                    <HiOutlineCurrencyRupee size={24} className="shrink-0" />
                    {pricePerHour || "0"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <FeedbackModal
        isOpen={feedback.open}
        onClose={close}
        variant={feedback.variant}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
      />

      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mx-auto">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                Leave this page?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-semibold">
                Your booking has not been saved yet.
              </p>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-black"
                >
                  Stay
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black"
                >
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
