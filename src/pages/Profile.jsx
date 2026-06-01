import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Table";
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineIdentification, 
  HiOutlineLocationMarker, 
  HiOutlineStar, 
  HiOutlineCalendar,
  HiOutlineCheckCircle
} from 'react-icons/hi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-center text-red-600 font-bold bg-red-50 rounded-2xl">{error}</div>;

  if (!user) return <div className="p-8 text-center font-bold text-slate-400">No user data found.</div>;

  const ProfileItem = ({ icon: Icon, label, value, color = "text-slate-600" }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
      <div className="p-2.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-6">
        <div className="h-24 w-24 bg-gradient-to-tr from-green-600 to-emerald-400 rounded-3xl flex items-center justify-center shadow-lg shadow-green-100">
          <HiOutlineUser size={48} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800">{user.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={user.role === 'admin' ? 'blue' : 'gray'}>{user.role}</Badge>
            <Badge variant={user.isActive ? 'green' : 'red'}>
              {user.isActive ? 'Account Active' : 'Deactivated'}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HiOutlineIdentification className="text-green-600" />
            Account Information
          </h2>
        </CardHeader>
        <CardBody className="grid gap-2">
          <ProfileItem icon={HiOutlineUser} label="Full Name" value={user.name} />
          <ProfileItem icon={HiOutlineMail} label="Email Address" value={user.email} />
          
          {user.location?.address && (
            <ProfileItem icon={HiOutlineLocationMarker} label="Primary Address" value={user.location.address} />
          )}

          {(user.role === "user" || user.role === "provider") && (
            <ProfileItem 
              icon={HiOutlineStar} 
              label="Trust Score" 
              value={user.trustScore || 0}
              color="text-yellow-600"
            />
          )}

          <ProfileItem 
            icon={HiOutlineCalendar} 
            label="Member Since" 
            value={new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} 
          />
          
          <ProfileItem 
            icon={HiOutlineCheckCircle} 
            label="Verification" 
            value={user.isVerified ? "Verified Identity" : "Basic Account"} 
            color={user.isVerified ? "text-green-600" : "text-slate-400"}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Profile;
