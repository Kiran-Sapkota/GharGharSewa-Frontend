import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { 
  HiOutlineLightningBolt, 
  HiOutlineChatAlt2, 
  HiOutlineSearch, 
  HiOutlineShieldCheck,
  HiOutlineSparkles
} from 'react-icons/hi';

const Home = () => {
  const { authUser } = useAuth();

  return (
    <div className="space-y-24 pb-20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-700">
            <HiOutlineSparkles size={16} />
            Trusted Home Solutions
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-800 dark:text-white leading-[0.9] tracking-tighter">
            Smart Home <span className="text-emerald-500">Service</span> Platform.
          </h1>

          <p className="text-xl font-bold text-slate-400 dark:text-slate-500 max-w-lg leading-relaxed">
            Finding verified professionals for your home is now smarter, faster, and powered by AI. Experience the future of home maintenance.
          </p>

          <div className="flex gap-4 flex-wrap pt-4">
            {!authUser ? (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-10">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Log In</Button>
                </Link>
              </>
            ) : (
              <Link to={authUser.role === 'user' ? '/search' : `/${authUser.role}-dashboard`}>
                <Button size="lg" className="px-10">Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>

        <div className="relative group">
          {/* Creative Card Stack Effect */}
          <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] rotate-3 -z-10 group-hover:rotate-6 transition-transform duration-500" />
          <Card className="!rounded-[3rem] shadow-2xl shadow-emerald-500/10 border-none">
            <CardBody className="p-12 space-y-10">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Our Services
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { name: "Electrician", icon: HiOutlineLightningBolt },
                  { name: "Plumber", icon: HiOutlineSparkles },
                  { name: "Cleaning", icon: HiOutlineSparkles },
                  { name: "Carpenter", icon: HiOutlineSparkles },
                  { name: "Repairing", icon: HiOutlineSparkles },
                  { name: "Painting", icon: HiOutlineSparkles },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 group/item text-center space-y-3 cursor-pointer"
                  >
                    <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-2xl mx-auto flex items-center justify-center text-emerald-500 shadow-sm group-hover/item:scale-110 transition-transform">
                      <service.icon size={24} />
                    </div>
                    <p className="font-black text-slate-700 dark:text-slate-300 text-sm uppercase tracking-wider">{service.name}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
        {[
          {
            title: "AI Chatbot",
            desc: "Describe your issues in natural language and let our AI guide you to the right solution.",
            icon: HiOutlineChatAlt2,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
          },
          {
            title: "Smart Ranking",
            desc: "Advanced algorithms rank providers based on distance, rating, and price for the best value.",
            icon: HiOutlineSearch,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          },
          {
            title: "Verified Pros",
            desc: "Every service provider is manually verified by our admin team for quality assurance.",
            icon: HiOutlineShieldCheck,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10"
          }
        ].map((feat, i) => (
          <Card key={i} className="hover:-translate-y-2 transition-all duration-300">
            <CardBody className="p-8 space-y-6">
              <div className={`w-16 h-16 rounded-[1.5rem] ${feat.bg} ${feat.color} flex items-center justify-center shadow-inner`}>
                <feat.icon size={32} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{feat.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{feat.desc}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Home;