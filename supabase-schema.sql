-- ============================================
-- African Joy Dairy - Feedback Database Schema
-- ============================================

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  rating_type TEXT NOT NULL CHECK (rating_type IN ('loved', 'okay', 'not_good'))
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON public.feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_rating_type ON public.feedback(rating_type);

-- Enable Row Level Security (RLS)
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback (public form)
CREATE POLICY "Allow public insert" ON public.feedback
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read feedback (dashboard)
CREATE POLICY "Allow authenticated read" ON public.feedback
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create a view for dashboard statistics
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
  COUNT(*) as total_reviews,
  ROUND(AVG(rating)::numeric, 2) as average_rating,
  ROUND((COUNT(*) FILTER (WHERE rating = 5)::numeric / NULLIF(COUNT(*), 0) * 100), 2) as five_star_percentage,
  ROUND((
    (COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::numeric -
     COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days')::numeric) /
    NULLIF(COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '14 days' AND created_at < NOW() - INTERVAL '7 days'), 0) * 100
  )::numeric, 1) as trend
FROM public.feedback;

-- Create a view for rating distribution
CREATE OR REPLACE VIEW public.rating_distribution AS
SELECT
  rating,
  COUNT(*) as count
FROM public.feedback
GROUP BY rating
ORDER BY rating DESC;

-- Create a view for ratings over time (monthly aggregation)
CREATE OR REPLACE VIEW public.ratings_over_time AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  ROUND(AVG(rating)::numeric, 2) as avg_rating,
  COUNT(*) as review_count
FROM public.feedback
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC
LIMIT 12;

-- Create a function to get filtered feedback
CREATE OR REPLACE FUNCTION public.get_filtered_feedback(
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_min_rating INTEGER DEFAULT NULL,
  p_max_rating INTEGER DEFAULT NULL,
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  name TEXT,
  location TEXT,
  rating INTEGER,
  feedback TEXT,
  rating_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id,
    f.created_at,
    f.name,
    f.location,
    f.rating,
    f.feedback,
    f.rating_type
  FROM public.feedback f
  WHERE
    (p_start_date IS NULL OR f.created_at >= p_start_date)
    AND (p_end_date IS NULL OR f.created_at <= p_end_date)
    AND (p_min_rating IS NULL OR f.rating >= p_min_rating)
    AND (p_max_rating IS NULL OR f.rating <= p_max_rating)
  ORDER BY f.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample data for testing
INSERT INTO public.feedback (name, location, rating, feedback, rating_type) VALUES
  ('John Doe', 'Nairobi', 5, 'Amazing milk! Best quality I have ever tasted.', 'loved'),
  ('Jane Smith', 'Mombasa', 5, 'Fresh and delicious. My family loves it!', 'loved'),
  ('Peter Omondi', 'Kisumu', 4, 'Very good product. Would recommend.', 'loved'),
  ('Mary Wanjiku', 'Nakuru', 5, 'Excellent dairy products. Keep it up!', 'loved'),
  ('David Kamau', 'Eldoret', 3, 'Good but could be better packaged.', 'okay'),
  ('Sarah Akinyi', 'Nairobi', 4, 'Great taste and quality.', 'loved'),
  ('Michael Otieno', 'Thika', 5, 'Superb! This is now my go-to milk brand.', 'loved'),
  ('Grace Njeri', 'Kiambu', 2, 'Delivery was late and milk was warm.', 'not_good'),
  ('James Mwangi', 'Nairobi', 5, 'Top quality dairy. Highly recommend!', 'loved'),
  ('Lucy Adhiambo', 'Mombasa', 4, 'Very fresh and creamy.', 'loved'),
  ('Patrick Kipchoge', 'Nakuru', 5, 'Best milk in Kenya!', 'loved'),
  ('Anne Wambui', 'Nairobi', 3, 'Decent quality but a bit pricey.', 'okay'),
  ('Robert Odhiambo', 'Kisumu', 5, 'Exceptional taste and freshness.', 'loved'),
  ('Elizabeth Chebet', 'Eldoret', 4, 'Good product, reliable delivery.', 'loved'),
  ('Daniel Karanja', 'Nairobi', 5, 'Outstanding! My whole family loves it.', 'loved');

-- Grant permissions to authenticated users
GRANT SELECT ON public.dashboard_stats TO authenticated;
GRANT SELECT ON public.rating_distribution TO authenticated;
GRANT SELECT ON public.ratings_over_time TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_filtered_feedback TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database schema created successfully!';
  RAISE NOTICE 'Sample data inserted: 15 feedback entries';
END $$;
