import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getRecommendations } from "../api/recommendationApi";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Table";
import { 
  HiOutlineStar, 
  HiOutlineLocationMarker, 
  HiOutlineCurrencyRupee, 
  HiOutlineMap, 
  HiOutlineShieldCheck,
  HiOutlineEmojiSad
} from 'react-icons/hi';

const Recommendations = () => {
  const [searchParams] = useSearchParams();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const category = searchParams.get("category");
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const problemDescription = searchParams.get("problemDescription");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await getRecommendations({
          category,
          latitude,
          longitude,
          problemDescription,
        });
        setRecommendations(res.data.recommendations || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [category, latitude, longitude, problemDescription]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">Ranking Experts...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter">
            Smart <span className="text-emerald-500">Picks.</span>
          </h1>
          <p className="text-lg font-bold text-slate-400 dark:text-slate-500 mt-2">Verified providers ranked by distance, rating, and expertise.</p>
        </div>
        <Link to="/search">
          <Button variant="secondary" className="rounded-2xl">Modify Search</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl font-bold">
          {error}
        </div>
      )}

      {recommendations.length === 0 ? (
        <Card className="p-20 text-center flex flex-col items-center">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 mb-6">
            <HiOutlineEmojiSad size={64} />
          </div>
          <h3 className="text-3xl font-black text-slate-800 dark:text-white">No matches found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8 font-bold">Try adjusting your search category or location.</p>
          <Link to="/search">
            <Button size="lg">Return to Search</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommendations.map((item) => (
            <Card key={item.provider._id} className="group hover:-translate-y-2 transition-all duration-300 shadow-xl shadow-emerald-500/5">
              <CardBody className="p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {item.provider.name}
                    </h2>
                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-wider">
                      <HiOutlineLocationMarker size={16} className="text-emerald-500" />
                      {item.provider.location?.address}
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20">
                    {item.finalScore.toFixed(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Point</p>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <HiOutlineCurrencyRupee className="text-emerald-500" />
                      {item.matchedService?.price || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pro Distance</p>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <HiOutlineMap className="text-blue-500" />
                      {item.distance} km
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar key={i} size={18} className={i < Math.floor(item.provider.rating || 0) ? 'fill-current' : 'opacity-20'} />
                      ))}
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200">{item.provider.rating || 0}</span>
                  </div>
                  {item.provider.isVerified && (
                    <Badge variant="blue">
                      <HiOutlineShieldCheck className="mr-1 inline" size={14} /> Verified
                    </Badge>
                  )}
                </div>

                <Link
                  to={`/booking/${item.provider._id}`}
                  state={{
                    provider: item.provider,
                    matchedService: item.matchedService,
                  }}
                  className="block pt-2"
                >
                  <Button className="w-full py-4 rounded-2xl shadow-emerald-500/10">Book Expert Now</Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;