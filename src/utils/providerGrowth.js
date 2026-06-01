const MS_PER_DAY = 24 * 60 * 60 * 1000;

const getActivityDate = (booking) =>
  new Date(booking.updatedAt || booking.createdAt);

const isInRange = (date, start, end) => {
  const d = new Date(date);
  return d >= start && d <= end;
};

/** % change; if previous is 0 and current > 0, treat as +100%. */
export const percentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const getPeriodMetrics = (bookings, reviews, periodStart, periodEnd) => {
  const completedInPeriod = (bookings || []).filter((b) => {
    if (b.status !== "completed") return false;
    return isInRange(getActivityDate(b), periodStart, periodEnd);
  });

  const jobs = completedInPeriod.length;
  const earnings = completedInPeriod.reduce(
    (sum, b) => sum + Number(b.totalPrice || 0),
    0
  );

  const periodReviews = (reviews || []).filter((r) =>
    isInRange(r.createdAt, periodStart, periodEnd)
  );

  const avgRating =
    periodReviews.length > 0
      ? periodReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        periodReviews.length
      : 0;

  return { jobs, earnings, avgRating, reviewCount: periodReviews.length };
};

/**
 * Composite growth (last 30 days vs previous 30 days):
 * 40% earnings · 35% completed jobs · 25% average rating
 */
export const calculateProviderGrowth = (bookings = [], reviews = []) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * MS_PER_DAY);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * MS_PER_DAY);

  const current = getPeriodMetrics(bookings, reviews, thirtyDaysAgo, now);
  const previous = getPeriodMetrics(bookings, reviews, sixtyDaysAgo, thirtyDaysAgo);

  const hasCurrent =
    current.jobs > 0 || current.earnings > 0 || current.reviewCount > 0;
  const hasPrevious =
    previous.jobs > 0 || previous.earnings > 0 || previous.reviewCount > 0;

  if (!hasCurrent && !hasPrevious) {
    return { percentage: 0, hasData: false };
  }

  const jobsGrowth = percentChange(current.jobs, previous.jobs);
  const earningsGrowth = percentChange(current.earnings, previous.earnings);
  const ratingGrowth = percentChange(current.avgRating, previous.avgRating);

  const percentage =
    0.35 * jobsGrowth + 0.4 * earningsGrowth + 0.25 * ratingGrowth;

  return { percentage, hasData: true };
};
