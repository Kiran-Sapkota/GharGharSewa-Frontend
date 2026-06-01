import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { submitProviderReview } from "../api/reviewApi";
import { getBookingById } from "../api/bookingApi";
import { Card, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StarRating } from "../components/ui/StarRating";
import { FeedbackModal } from "../components/ui/FeedbackModal";
import { useFeedbackModal } from "../hooks/useFeedbackModal";
import {
  HiOutlineChatAlt,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
} from "react-icons/hi";

const ReviewSubmit = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAlreadyReviewed, setIsAlreadyReviewed] = useState(false);
  const { feedback, close, showSuccess, showError } = useFeedbackModal();

  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        setLoading(true);
        const res = await getBookingById(bookingId);
        if (res.data.booking.isReviewed) {
          setIsAlreadyReviewed(true);
        }
      } catch (err) {
        setError("Could not verify booking status.");
      } finally {
        setLoading(false);
      }
    };
    checkBookingStatus();
  }, [bookingId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.rating || formData.rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    if (!formData.comment.trim()) {
      setError("Please share a short comment about your experience.");
      return;
    }

    try {
      setLoading(true);
      await submitProviderReview({
        bookingId,
        rating: Number(formData.rating),
        comment: formData.comment,
      });
      showSuccess(
        "Review submitted!",
        "Thank you for helping the community.",
        () => navigate("/bookings")
      );
    } catch (err) {
      showError(
        "Could not submit review",
        err.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400 font-black text-[10px] uppercase tracking-widest border border-amber-100 dark:border-amber-500/20">
          <HiOutlineSparkles size={14} />
          Feedback Loop
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">
          Share Your <span className="text-amber-500">Experience.</span>
        </h1>
        <p className="text-lg font-bold text-slate-400 dark:text-slate-500">
          Your reviews help others find the best service providers.
        </p>
      </div>

      <Card className="!rounded-[3rem] shadow-2xl shadow-amber-500/5">
        <CardBody className="p-8 md:p-12">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl mb-8 font-bold text-sm">
              {error}
            </div>
          )}

          {isAlreadyReviewed ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <HiOutlineShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white">Review Already Submitted</h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold">You've already shared your feedback for this service. Thank you!</p>
              </div>
              <Button onClick={() => navigate('/bookings')} variant="secondary">Go to Bookings</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-8">
            <div className="space-y-3 py-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-center">
                Overall satisfaction
              </label>
              <StarRating
                value={formData.rating}
                onChange={(rating) =>
                  setFormData((prev) => ({ ...prev, rating }))
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <HiOutlineChatAlt size={16} className="text-emerald-500" />
                Detailed Feedback
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="What did you like or dislike about the service?"
                rows="5"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-8 py-6 rounded-[2rem] focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 dark:text-white leading-relaxed"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full py-5 rounded-[2rem] text-xl"
              >
                {loading ? "Submitting..." : "Post Review"}
              </Button>
            </div>
          </form>
          )}
        </CardBody>
      </Card>

      <div className="flex items-center justify-center gap-6 text-slate-400 dark:text-slate-600 font-black text-[10px] uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <HiOutlineShieldCheck size={16} /> Verified Booking
        </div>
        <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="flex items-center gap-2">
          Public Review
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
    </div>
  );
};

export default ReviewSubmit;