const VARIANTS = {
  success: {
    icon: "✓",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    buttonClass: "bg-emerald-500 hover:bg-emerald-600 text-white",
  },
  error: {
    icon: "✕",
    iconBg: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    buttonClass: "bg-red-500 hover:bg-red-600 text-white",
  },
  warning: {
    icon: "!",
    iconBg: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    buttonClass: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600",
  },
};

export const FeedbackModal = ({
  isOpen,
  onClose,
  variant = "success",
  title,
  message,
  confirmLabel = "OK",
  onConfirm,
}) => {
  if (!isOpen) return null;

  const style = VARIANTS[variant] || VARIANTS.success;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] px-4">
      <div
        className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
      >
        <div className="space-y-5 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-black ${style.iconBg}`}
          >
            {style.icon}
          </div>

          <div className="space-y-2">
            <h2
              id="feedback-modal-title"
              className="text-2xl font-black text-slate-800 dark:text-white"
            >
              {title}
            </h2>
            {message && (
              <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className={`w-full py-4 rounded-2xl font-black transition-colors ${style.buttonClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
