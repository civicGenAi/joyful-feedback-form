import { supabase } from './supabase';

export interface Feedback {
  id: string;
  created_at: string;
  name: string | null;
  location: string | null;
  rating: number;
  feedback: string | null;
  rating_type: 'loved' | 'okay' | 'not_good';
}

export interface DashboardStats {
  total_reviews: number;
  average_rating: number;
  five_star_percentage: number;
  trend: number;
}

export interface RatingDistribution {
  rating: number;
  count: number;
}

export interface RatingsOverTime {
  month: string;
  avg_rating: number;
  review_count: number;
}

export interface FeedbackFilters {
  startDate?: Date;
  endDate?: Date;
  minRating?: number;
  maxRating?: number;
  limit?: number;
  offset?: number;
}

// Fetch dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats | null> => {
  const { data, error } = await supabase
    .from('dashboard_stats')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }

  return data;
};

// Fetch rating distribution
export const getRatingDistribution = async (): Promise<RatingDistribution[]> => {
  const { data, error } = await supabase
    .from('rating_distribution')
    .select('*')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching rating distribution:', error);
    return [];
  }

  return data || [];
};

// Fetch ratings over time (monthly)
export const getRatingsOverTime = async (): Promise<RatingsOverTime[]> => {
  const { data, error } = await supabase
    .from('ratings_over_time')
    .select('*')
    .order('month', { ascending: true });

  if (error) {
    console.error('Error fetching ratings over time:', error);
    return [];
  }

  return data || [];
};

// Fetch recent feedback with optional filters
export const getFeedback = async (filters?: FeedbackFilters): Promise<Feedback[]> => {
  let query = supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate.toISOString());
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate.toISOString());
  }

  if (filters?.minRating) {
    query = query.gte('rating', filters.minRating);
  }

  if (filters?.maxRating) {
    query = query.lte('rating', filters.maxRating);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching feedback:', error);
    return [];
  }

  return data || [];
};

// Submit new feedback
export const submitFeedback = async (feedback: {
  name?: string;
  location?: string;
  rating: number;
  feedback?: string;
  rating_type: 'loved' | 'okay' | 'not_good';
}): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase.from('feedback').insert([
    {
      name: feedback.name || null,
      location: feedback.location || null,
      rating: feedback.rating,
      feedback: feedback.feedback || null,
      rating_type: feedback.rating_type,
    },
  ]);

  if (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

// Get filtered stats based on filters
export const getFilteredStats = async (filters?: FeedbackFilters): Promise<DashboardStats | null> => {
  const feedback = await getFeedback(filters);

  if (feedback.length === 0) {
    return {
      total_reviews: 0,
      average_rating: 0,
      five_star_percentage: 0,
      trend: 0,
    };
  }

  const totalReviews = feedback.length;
  const averageRating = feedback.reduce((sum, f) => sum + f.rating, 0) / totalReviews;
  const fiveStarCount = feedback.filter((f) => f.rating === 5).length;
  const fiveStarPercentage = (fiveStarCount / totalReviews) * 100;

  // Calculate trend (comparing first half vs second half)
  const midpoint = Math.floor(totalReviews / 2);
  const firstHalf = feedback.slice(0, midpoint);
  const secondHalf = feedback.slice(midpoint);

  const firstHalfAvg = firstHalf.length > 0
    ? firstHalf.reduce((sum, f) => sum + f.rating, 0) / firstHalf.length
    : 0;
  const secondHalfAvg = secondHalf.length > 0
    ? secondHalf.reduce((sum, f) => sum + f.rating, 0) / secondHalf.length
    : 0;

  const trend = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

  return {
    total_reviews: totalReviews,
    average_rating: Math.round(averageRating * 100) / 100,
    five_star_percentage: Math.round(fiveStarPercentage * 100) / 100,
    trend: Math.round(trend * 10) / 10,
  };
};

// Get filtered rating distribution
export const getFilteredRatingDistribution = async (
  filters?: FeedbackFilters
): Promise<RatingDistribution[]> => {
  const feedback = await getFeedback(filters);

  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  feedback.forEach((f) => {
    distribution[f.rating] = (distribution[f.rating] || 0) + 1;
  });

  return Object.entries(distribution)
    .map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
    }))
    .sort((a, b) => b.rating - a.rating);
};
