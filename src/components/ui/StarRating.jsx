import { useState } from "react";
import { HiStar, HiOutlineStar } from "react-icons/hi";

const RATING_LABELS = {
  0: "Select a rating",
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

export const StarRating = ({ value = 0, onChange, disabled = false }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const active = hoverValue || value;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => !disabled && setHoverValue(0)}
        role="radiogroup"
        aria-label="Overall satisfaction rating"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= active;
          const Icon = isFilled ? HiStar : HiOutlineStar;

          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(star)}
              onMouseEnter={() => !disabled && setHoverValue(star)}
              aria-label={`${star} out of 5 stars`}
              className={`p-1 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                isFilled
                  ? "text-emerald-500 hover:text-emerald-600"
                  : "text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500"
              }`}
            >
              <Icon size={36} className={isFilled ? "fill-current" : ""} />
            </button>
          );
        })}
      </div>

      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-h-[1.25rem]">
        {RATING_LABELS[active]}
      </p>
    </div>
  );
};
