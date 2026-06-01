import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { sendChatMessage } from "../api/chatbotApi";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { HiOutlineChatAlt2, HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineDotsHorizontal } from 'react-icons/hi';

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Namaste! I am your GharGhar Sewa assistant. How can I help you with your home services today?",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [showRecommendationButton, setShowRecommendationButton] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { sender: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await sendChatMessage(message);
      const replies = res.data.botReplies || [];

      replies.forEach((reply) => {
        setChat((prev) => [...prev, { sender: "bot", text: reply }]);
        if (reply.toLowerCase().includes("major") || reply.toLowerCase().includes("provider") || reply.toLowerCase().includes("book")) {
          setShowRecommendationButton(true);
        }
      });
    } catch (err) {
      setChat((prev) => [...prev, { sender: "bot", text: "I'm having a bit of a technical hiccup. Please try again in a moment!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-3">
            AI Assistant <HiOutlineSparkles className="text-emerald-500" />
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Powered by GharGhar Sewa NLU</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800" />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 self-center">+120 active users</p>
        </div>
      </div>

      <Card className="h-[70vh] flex flex-col !rounded-[2.5rem] shadow-2xl shadow-emerald-500/5">
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {chat.map((item, index) => (
            <div
              key={index}
              className={`flex ${item.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[80%] px-6 py-4 rounded-[1.5rem] font-bold text-sm leading-relaxed shadow-sm ${
                  item.sender === "user"
                    ? "bg-emerald-500 text-white rounded-br-none"
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-700/50"
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 rounded-[1.5rem] rounded-bl-none">
                <HiOutlineDotsHorizontal size={24} className="text-slate-400" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {showRecommendationButton && (
          <div className="px-8 pb-4 animate-in fade-in zoom-in duration-500">
            <Link to="/search">
              <Button variant="secondary" className="w-full text-xs py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                🚀 Find Professional Providers Now
              </Button>
            </Link>
          </div>
        )}

        <form onSubmit={handleSend} className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-4">
          <input
            type="text"
            placeholder="Describe your home issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
            className="flex-1 bg-white dark:bg-slate-800 border-2 border-transparent px-6 py-4 rounded-2xl focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white"
          />

          <Button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-2xl px-6 aspect-square"
          >
            <HiOutlinePaperAirplane size={24} className="rotate-90" />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Chatbot;