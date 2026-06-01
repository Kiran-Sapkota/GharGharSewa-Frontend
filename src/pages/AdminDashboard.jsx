import { useEffect, useState } from "react";
import {
  getAllUsers,
  getAllProvidersAdmin,
  getAllBookingsAdmin,
  getAllServicesAdmin,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  verifyProvider,
  unverifyProvider,
  deactivateAccount,
  reactivateAccount,
} from "../api/adminApi";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Table, THead, TBody, TR, TH, TD, Badge } from "../components/ui/Table";
import { 
  HiOutlineUsers, 
  HiOutlineUserGroup, 
  HiOutlineClipboardCheck, 
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineCollection,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineX
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const emptyServiceForm = {
    name: "",
    label: "",
    description: "",
    icon: "🔧",
    isActive: true,
  };
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [deleteServiceLoading, setDeleteServiceLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, providersRes, bookingsRes, servicesRes] = await Promise.all([
        getAllUsers(),
        getAllProvidersAdmin(),
        getAllBookingsAdmin(),
        getAllServicesAdmin(),
      ]);
      setUsers(usersRes.data.users || []);
      setProviders(providersRes.data.providers || []);
      setBookings(bookingsRes.data.bookings || []);
      setServices(servicesRes.data.categories || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (providerId) => {
    try {
      await verifyProvider(providerId);
      setMessage("Provider verified! ✅");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify provider");
    }
  };

  const handleUnverify = async (providerId) => {
    try {
      await unverifyProvider(providerId);
      setMessage("Provider unverified! ⚠️");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unverify provider");
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await deactivateAccount(userId);
      setMessage("Account deactivated! 🛑");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to deactivate account");
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await reactivateAccount(userId);
      setMessage("Account reactivated! 🚀");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reactivate account");
    }
  };

  const resetServiceForm = () => {
    setServiceForm(emptyServiceForm);
    setEditingServiceId(null);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingServiceId) {
        await updateServiceCategory(editingServiceId, serviceForm);
        setMessage("Service updated! ✅");
      } else {
        await createServiceCategory(serviceForm);
        setMessage("New service added! ✅");
      }
      resetServiceForm();
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save service");
    }
  };

  const handleEditService = (service) => {
    setEditingServiceId(service._id);
    setServiceForm({
      name: service.name,
      label: service.label,
      description: service.description || "",
      icon: service.icon || "🔧",
      isActive: service.isActive,
    });
    setMessage("");
    setError("");
  };

  const openDeleteServiceModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteServiceModal(true);
    setError("");
    setMessage("");
  };

  const closeDeleteServiceModal = () => {
    setShowDeleteServiceModal(false);
    setServiceToDelete(null);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleteServiceLoading(true);
      await deleteServiceCategory(serviceToDelete._id);
      setMessage("Service deleted! 🗑️");
      if (editingServiceId === serviceToDelete._id) resetServiceForm();
      closeDeleteServiceModal();
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete service");
      closeDeleteServiceModal();
    } finally {
      setDeleteServiceLoading(false);
    }
  };

  const handleToggleServiceActive = async (service) => {
    setError("");
    setMessage("");
    try {
      await updateServiceCategory(service._id, { isActive: !service.isActive });
      setMessage(service.isActive ? "Service deactivated." : "Service activated! ✅");
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service status");
    }
  };

  const stats = [
    { label: 'Platform Users', value: users.length, icon: HiOutlineUsers, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Service Pros', value: providers.length, icon: HiOutlineUserGroup, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'System Bookings', value: bookings.length, icon: HiOutlineClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Service Lines', value: services.length, icon: HiOutlineCollection, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">Control <span className="text-emerald-500">Center.</span></h1>
          <p className="text-lg font-bold text-slate-400 dark:text-slate-500">Monitor and manage the entire GharGhar Sewa ecosystem.</p>
        </div>
        <Button variant="secondary" onClick={fetchAdminData} className="group">
          <HiOutlineRefresh className="mr-2 group-hover:rotate-180 transition-transform duration-700" size={20} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
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
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {(message || error) && (
        <div className={`px-8 py-5 rounded-[2rem] font-black shadow-xl animate-in slide-in-from-top-4 duration-500 ${
          message ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-red-500 text-white shadow-red-500/20'
        }`}>
          {message || error}
        </div>
      )}

      {/* Management Area */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit">
            {['users', 'providers', 'bookings', 'services'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-widest ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-emerald-500 dark:text-emerald-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative group flex-1 max-w-xs">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              placeholder="Search records..." 
              autoFocus
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent pl-11 pr-4 py-3 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 outline-none transition-all text-sm font-bold"
            />
          </div>
        </div>
        
        <Card className="!rounded-[2.5rem]">
          <CardBody className="p-2">
            {activeTab === "users" && (
              <Table>
                <THead>
                  <TR className="!bg-transparent shadow-none">
                    <TH>User Identity</TH>
                    <TH>System Role</TH>
                    <TH>Trust Score</TH>
                    <TH>Account State</TH>
                    <TH className="text-right pr-12">Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {users.map((user) => (
                    <TR key={user._id}>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">{user.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{user.email}</p>
                      </TD>
                      <TD>
                        <Badge variant={user.role === 'admin' ? 'blue' : 'gray'}>{user.role}</Badge>
                      </TD>
                      <TD className="font-black text-slate-600 dark:text-slate-300">{user.rating || 0} / 5</TD>
                      <TD>
                        <Badge variant={user.isActive ? 'green' : 'red'}>
                          {user.isActive ? 'Active' : 'Suspended'}
                        </Badge>
                      </TD>
                      <TD className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant={user.isActive ? 'ghost' : 'primary'}
                          className={user.isActive ? 'text-red-500 hover:bg-red-50' : ''}
                          onClick={() => user.isActive ? handleDeactivate(user._id) : handleReactivate(user._id)}
                        >
                          {user.isActive ? 'Suspend' : 'Unsuspend'}
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {activeTab === "providers" && (
              <Table>
                <THead>
                  <TR className="!bg-transparent shadow-none">
                    <TH>Service Pro</TH>
                    <TH>Service Line</TH>
                    <TH>Verification</TH>
                    <TH>Availability</TH>
                    <TH className="text-right pr-12">Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {providers.map((provider) => (
                    <TR key={provider._id}>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">{provider.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">{provider.user?.email || "N/A"}</p>
                      </TD>
                      <TD>
                        <p className="font-black text-slate-600 dark:text-slate-300 capitalize">{provider.services?.[0]?.category || "N/A"}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rs. {provider.services?.[0]?.price || 0}</p>
                      </TD>
                      <TD>
                        <Badge variant={provider.isVerified ? 'green' : 'yellow'}>
                          {provider.isVerified ? 'Verified' : 'Pending Review'}
                        </Badge>
                      </TD>
                      <TD>
                        <Badge variant={provider.isAvailable ? 'blue' : 'gray'}>
                          {provider.isAvailable ? 'Online' : 'Offline'}
                        </Badge>
                      </TD>
                      <TD className="text-right pr-8">
                        <Button 
                          size="sm" 
                          variant={provider.isVerified ? 'secondary' : 'primary'}
                          onClick={() => provider.isVerified ? handleUnverify(provider._id) : handleVerify(provider._id)}
                        >
                          {provider.isVerified ? 'Revoke' : 'Approve'}
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {activeTab === "bookings" && (
              <Table>
                <THead>
                  <TR className="!bg-transparent shadow-none">
                    <TH>Customer & Pro</TH>
                    <TH>Service Line</TH>
                    <TH>Transaction</TH>
                    <TH>Current State</TH>
                  </TR>
                </THead>
                <TBody>
                  {bookings.map((booking) => (
                    <TR key={booking._id}>
                      <TD>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-sm font-black text-slate-800 dark:text-slate-100">{booking.user?.name || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{booking.provider?.name || "N/A"}</span>
                          </div>
                        </div>
                      </TD>
                      <TD className="font-black text-slate-600 dark:text-slate-300 capitalize">{booking.serviceCategory}</TD>
                      <TD>
                        <p className="text-base font-black text-slate-800 dark:text-slate-100">Rs. {booking.totalPrice}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </TD>
                      <TD>
                        <Badge variant={
                          booking.status === 'completed' ? 'green' : 
                          booking.status === 'confirmed' ? 'blue' : 
                          booking.status === 'pending' ? 'yellow' : 'red'
                        }>{booking.status}</Badge>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}

            {activeTab === "services" && (
              <div className="space-y-10 p-6">
                <form onSubmit={handleServiceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                  <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        {editingServiceId ? (
                          <HiOutlinePencil className="text-amber-500" />
                        ) : (
                          <HiOutlinePlus className="text-emerald-500" />
                        )}
                        {editingServiceId ? "Edit Service" : "Add New Service"}
                      </h3>
                      <p className="text-sm font-bold text-slate-400 mt-1">Slug (name) is stored lowercase, e.g. ac repair</p>
                    </div>
                    {editingServiceId && (
                      <Button type="button" variant="secondary" onClick={resetServiceForm}>
                        <HiOutlineX className="mr-2" size={18} />
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                  <input
                    required
                    placeholder="Slug (e.g. ac repair)"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl font-bold outline-none focus:border-emerald-500"
                  />
                  <input
                    required
                    placeholder="Display label (e.g. AC Repair)"
                    value={serviceForm.label}
                    onChange={(e) => setServiceForm({ ...serviceForm, label: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl font-bold outline-none focus:border-emerald-500"
                  />
                  <input
                    placeholder="Icon (emoji)"
                    value={serviceForm.icon}
                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl font-bold outline-none focus:border-emerald-500"
                  />
                  <input
                    placeholder="Short description"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 px-6 py-4 rounded-2xl font-bold outline-none focus:border-emerald-500"
                  />
                  {editingServiceId && (
                    <label className="md:col-span-2 flex items-center gap-3 cursor-pointer px-2">
                      <input
                        type="checkbox"
                        checked={serviceForm.isActive}
                        onChange={(e) => setServiceForm({ ...serviceForm, isActive: e.target.checked })}
                        className="w-5 h-5 rounded accent-emerald-500"
                      />
                      <span className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                        Active (visible on search)
                      </span>
                    </label>
                  )}
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full md:w-auto">
                      {editingServiceId ? (
                        <>
                          <HiOutlinePencil className="mr-2" size={18} />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <HiOutlinePlus className="mr-2" size={18} />
                          Add Service
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <Table>
                  <THead>
                    <TR className="!bg-transparent shadow-none">
                      <TH>Service</TH>
                      <TH>Slug</TH>
                      <TH>Description</TH>
                      <TH>Status</TH>
                      <TH className="text-right pr-12">Actions</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {services.map((service) => (
                      <TR key={service._id} className={editingServiceId === service._id ? "ring-2 ring-amber-400/50" : ""}>
                        <TD>
                          <p className="text-base font-black text-slate-800 dark:text-slate-100">
                            {service.icon} {service.label}
                          </p>
                        </TD>
                        <TD className="font-mono text-sm text-slate-500">{service.name}</TD>
                        <TD className="text-sm font-bold text-slate-500 max-w-xs truncate">{service.description || "—"}</TD>
                        <TD>
                          <Badge variant={service.isActive ? "green" : "gray"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TD>
                        <TD className="text-right pr-8">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => handleEditService(service)}>
                              <HiOutlinePencil size={16} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleServiceActive(service)}
                            >
                              {service.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:bg-red-50"
                              onClick={() => openDeleteServiceModal(service)}
                            >
                              <HiOutlineTrash size={16} className="mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {showDeleteServiceModal && serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mx-auto">
                <span className="text-3xl">⚠️</span>
              </div>

              <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                Delete Service
              </h2>

              <p className="text-slate-500 dark:text-slate-400 font-semibold">
                Are you sure you want to delete{" "}
                <span className="text-slate-800 dark:text-white font-black">
                  {serviceToDelete.icon} {serviceToDelete.label}
                </span>
                ? This cannot be undone.
              </p>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeDeleteServiceModal}
                  disabled={deleteServiceLoading}
                  className="flex-1 py-4 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-black"
                >
                  No
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteService}
                  disabled={deleteServiceLoading}
                  className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black disabled:opacity-60"
                >
                  {deleteServiceLoading ? "Deleting..." : "Yes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;