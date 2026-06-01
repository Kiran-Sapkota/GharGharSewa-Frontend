import { useEffect, useState } from "react";
import {
  createProviderProfile,
  updateProviderProfile,
  toggleProviderAvailability,
  getProviderMe,
} from "../api/providerApi";
import {
  getProviderBookings,
  updateBookingStatus,
  archiveProviderBooking,
  unarchiveProviderBooking,
} from "../api/bookingApi";
import { getProviderReviews } from "../api/reviewApi";
import { getActiveServices } from "../api/serviceApi";
import { calculateProviderGrowth } from "../utils/providerGrowth";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table, THead, TBody, TR, TH, TD, Badge } from "../components/ui/Table";
import { Modal } from "../components/ui/Modal";
import { LeafletMap } from "../components/ui/LeafletMap";
import { FeedbackModal } from "../components/ui/FeedbackModal";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import { 
  HiOutlineClipboardList, 
  HiOutlineCurrencyRupee, 
  HiOutlineStar, 
  HiOutlineStatusOnline,
  HiOutlinePlus,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineLocationMarker
} from 'react-icons/hi';

const getGoogleMapsDirectionsUrl = (latitude, longitude, address) => {
  if (latitude != null && longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  }
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
  return null;
};

const ProviderDashboard = () => {
  const [profileForm, setProfileForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    address: "",
    latitude: "27.7172",
    longitude: "85.3240",
  });

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [providerProfile, setProviderProfile] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { feedback, close, showError, showWarning, showSuccess } = useFeedbackModal();
  const [showArchived, setShowArchived] = useState(false);

  const fetchProviderData = async () => {
    // Fetch categories independently so they load even if profile doesn't exist yet
    getActiveServices()
      .then((res) => setServiceCategories(res.data.categories || []))
      .catch(() => {});

    try {
      const [bookingsRes, profileRes] = await Promise.all([
        getProviderBookings(),
        getProviderMe(),
      ]);
      setBookings(bookingsRes.data.bookings || []);
      const provider = profileRes.data.provider;
      setProviderProfile(provider);

      if (provider?._id) {
        try {
          const reviewsRes = await getProviderReviews(provider._id);
          setReviews(reviewsRes.data.reviews || []);
        } catch {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }

      // Auto-fill form if profile exists
      if (provider) {
        const p = provider;
        setProfileForm({
          name: p.name || "",
          category: p.services?.[0]?.category || "",
          description: p.services?.[0]?.description || "",
          price: p.services?.[0]?.price || "",
          address: p.location?.address || "",
          latitude: p.location?.latitude || "27.7172",
          longitude: p.location?.longitude || "85.3240",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showWarning(
        "Location unavailable",
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfileForm((prev) => ({
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

  const buildProfilePayload = () => ({
    name: profileForm.name,
    services: [
      {
        category: profileForm.category,
        description: profileForm.description,
        price: Number(profileForm.price),
      },
    ],
    location: {
      address: profileForm.address,
      latitude: Number(profileForm.latitude),
      longitude: Number(profileForm.longitude),
    },
  });

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await createProviderProfile(buildProfilePayload());
      setMessage("Profile created successfully! 🚀");
      setIsProfileModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile");
    }
  };

  const handleUpdateProfile = async () => {
    setMessage("");
    setError("");

    try {
      await updateProviderProfile(buildProfilePayload());
      setMessage("Profile updated! ✨");
      setIsProfileModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleToggleAvailability = async () => {
    setMessage("");
    setError("");

    try {
      const res = await toggleProviderAvailability();
      setMessage(`Status updated: ${res.data.isAvailable ? 'Online & Ready' : 'Offline Mode'}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update availability");
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      fetchProviderData();
    } catch (err) {
      showError(
        "Update failed",
        err.response?.data?.message || "Failed to update booking status."
      );
    }
  };

  const handleArchiveBooking = (booking) => {
    showWarning(
      "Archive this order?",
      "It will be hidden from your active list. You can restore it from the archive anytime.",
      async () => {
        try {
          await archiveProviderBooking(booking._id);
          showSuccess("Order archived", "The order has been moved to your archive.");
          fetchProviderData();
        } catch (err) {
          showError(
            "Archive failed",
            err.response?.data?.message || "Could not archive this order."
          );
        }
      }
    );
  };

  const handleRestoreBooking = async (bookingId) => {
    try {
      await unarchiveProviderBooking(bookingId);
      showSuccess("Order restored", "The order is back in your active list.");
      fetchProviderData();
    } catch (err) {
      showError(
        "Restore failed",
        err.response?.data?.message || "Could not restore this order."
      );
    }
  };

  const activeBookings = bookings.filter((b) => !b.isArchivedByProvider);
  const archivedBookings = bookings.filter((b) => b.isArchivedByProvider);
  const displayedBookings = showArchived ? archivedBookings : activeBookings;

  const getGrowthStats = () => {
    const defaultStat = {
      value: "0%",
      icon: HiOutlineTrendingUp,
      color: "text-slate-500",
      bg: "bg-slate-500/10",
    };

    const { percentage, hasData } = calculateProviderGrowth(bookings, reviews);
    if (!hasData) return defaultStat;

    const isNegative = percentage < 0;
    const rounded = Math.round(percentage);

    return {
      value: `${rounded >= 0 ? "+" : ""}${rounded}%`,
      icon: isNegative ? HiOutlineTrendingDown : HiOutlineTrendingUp,
      color: isNegative ? "text-rose-500" : "text-indigo-500",
      bg: isNegative ? "bg-rose-500/10" : "bg-indigo-500/10",
    };
  };

  const growthStats = getGrowthStats();

  const stats = [
    { label: 'Total Jobs', value: bookings.length, icon: HiOutlineClipboardList, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Earnings', value: `Rs. ${bookings.reduce((acc, b) => b.status === 'completed' ? acc + b.totalPrice : acc, 0)}`, icon: HiOutlineCurrencyRupee, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    {
      label: 'Rating',
      value: providerProfile?.rating != null ? Number(providerProfile.rating).toFixed(1) : '0.0',
      icon: HiOutlineStar,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Growth',
      value: growthStats.value,
      icon: growthStats.icon,
      color: growthStats.color,
      bg: growthStats.bg,
      hint: 'Jobs, earnings & ratings vs last 30 days',
    },
  ];

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'confirmed': return 'blue';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-12">
      {providerProfile && !providerProfile.isVerified && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl px-6 py-4 flex items-start gap-4">
          <span className="text-2xl mt-0.5">⏳</span>
          <div>
            <p className="font-black text-amber-800 dark:text-amber-400">Account Pending Approval</p>
            <p className="text-sm font-medium text-amber-700 dark:text-amber-500 mt-1">
              Your registration request has been submitted. Please contact the admin to get your account approved. You will receive an email once approved.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">Overview</h1>
          <p className="text-lg font-bold text-slate-400 dark:text-slate-500 mt-2">Manage your professional service performance.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleToggleAvailability} className="backdrop-blur-md">
            {message.includes('Online') ? 'Go Offline' : 'Go Online'}
          </Button>
          <Button onClick={() => setIsProfileModalOpen(true)} className="group">
            <HiOutlinePlus className="mr-2 group-hover:rotate-90 transition-transform" size={20} />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="group hover:-translate-y-2 transition-all duration-300">
            <CardBody className="flex items-center gap-6">
              <div className={`p-4 rounded-3xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={32} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</h3>
                {stat.hint && (
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 max-w-[140px] leading-tight">
                    {stat.hint}
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {message && (
        <div className="bg-emerald-500 text-white px-8 py-5 rounded-[2rem] font-black shadow-xl shadow-emerald-500/20 animate-in slide-in-from-top-4 duration-500 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <HiOutlineStatusOnline size={24} />
          </div>
          {message}
        </div>
      )}

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {showArchived ? "Archived Orders" : "Recent Orders"}
          </h2>
          <button
            type="button"
            onClick={() => setShowArchived((prev) => !prev)}
            className="text-sm font-black text-emerald-500 uppercase tracking-widest hover:underline underline-offset-8"
          >
            {showArchived ? "Back to orders" : `View Archive (${archivedBookings.length})`}
          </button>
        </div>

        <Card className="!rounded-[2.5rem]">
          <CardBody className="p-2">
            <Table>
              <THead>
                <TR className="!bg-transparent shadow-none border-none">
                  <TH>Service</TH>
                  <TH>Customer</TH>
                  <TH>Location</TH>
                  <TH>Price</TH>
                  <TH>Status</TH>
                  <TH className="text-right pr-12">Action</TH>
                </TR>
              </THead>
              <TBody>
                {displayedBookings.length === 0 ? (
                  <TR>
                    <TD colSpan="6" className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest italic">
                      {showArchived
                        ? "No archived orders yet."
                        : "No active bookings found."}
                    </TD>
                  </TR>
                ) : (
                  displayedBookings.map((booking) => {
                    const mapsUrl = getGoogleMapsDirectionsUrl(
                      booking.latitude,
                      booking.longitude,
                      booking.address
                    );
                    return (
                    <TR key={booking._id}>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">{booking.serviceCategory}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-tighter mt-0.5">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </TD>
                      <TD>
                        <p className="font-bold text-slate-600 dark:text-slate-300">{booking.user?.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{booking.user?.email}</p>
                      </TD>
                      <TD className="min-w-[160px] max-w-[220px]">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 break-words leading-snug">
                          {booking.address || "—"}
                        </p>
                        {mapsUrl && (
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-colors"
                          >
                            <HiOutlineLocationMarker size={14} />
                            Open in Google Maps
                          </a>
                        )}
                      </TD>
                      <TD className="text-lg font-black text-slate-800 dark:text-slate-100">Rs. {booking.totalPrice}</TD>
                      <TD>
                        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                      </TD>
                      <TD className="text-right pr-8">
                        <div className="flex flex-wrap justify-end gap-2">
                          {showArchived ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleRestoreBooking(booking._id)}
                            >
                              Restore
                            </Button>
                          ) : (
                            <>
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "confirmed")
                                  }
                                >
                                  Accept
                                </Button>
                              )}
                              {["confirmed", "pending"].includes(booking.status) && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleStatusUpdate(booking._id, "completed")
                                  }
                                >
                                  Finish
                                </Button>
                              )}
                              {booking.status !== "cancelled" &&
                                booking.status !== "completed" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-500 hover:bg-red-50"
                                    onClick={() =>
                                      handleStatusUpdate(booking._id, "cancelled")
                                    }
                                  >
                                    Reject
                                  </Button>
                                )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => handleArchiveBooking(booking)}
                              >
                                Archive
                              </Button>
                            </>
                          )}
                        </div>
                      </TD>
                    </TR>
                    );
                  })
                )}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Profile Modal */}
      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
        title="Setup Your Profile"
      >
        <form onSubmit={handleCreateProfile} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
              <input
                name="name"
                placeholder="e.g. Master Electricians"
                value={profileForm.name}
                onChange={handleProfileChange}
                autoFocus
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Specialization</label>
              <select
                name="category"
                value={profileForm.category}
                onChange={handleProfileChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white appearance-none cursor-pointer"
              >
                <option value="" disabled>Select a service category</option>
                {serviceCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">About Services</label>
              <textarea
                name="description"
                placeholder="Describe your expertise..."
                value={profileForm.description}
                onChange={handleProfileChange}
                rows="3"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Hourly Rate</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Rs."
                  value={profileForm.price}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Work Zone</label>
                <input
                  name="address"
                  placeholder="City, Area"
                  value={profileForm.address}
                  onChange={handleProfileChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Location</label>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="text-xs font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest hover:underline flex items-center gap-1.5 focus:outline-none transition-all group"
                >
                  <HiOutlineLocationMarker className="group-hover:scale-125 transition-transform" size={14} />
                  Use My Location
                </button>
              </div>

              {/* Interactive map picker */}
              <div className="rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner" style={{ height: '280px' }}>
                <LeafletMap
                  latitude={profileForm.latitude}
                  longitude={profileForm.longitude}
                  onChange={(lat, lng) =>
                    setProfileForm((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                  }
                />
              </div>

              {/* Coordinate readout */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <HiOutlineLocationMarker className="text-emerald-500 flex-shrink-0" size={18} />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="text-slate-800 dark:text-white font-black">{Number(profileForm.latitude).toFixed(4)}°N</span>
                  {' · '}
                  <span className="text-slate-800 dark:text-white font-black">{Number(profileForm.longitude).toFixed(4)}°E</span>
                  <span className="ml-2 text-slate-400">— Click or drag the pin to adjust</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1 shadow-emerald-500/20">Init Profile</Button>
            <Button type="button" variant="secondary" onClick={handleUpdateProfile} className="flex-1">Sync Changes</Button>
          </div>
        </form>
      </Modal>

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

export default ProviderDashboard;