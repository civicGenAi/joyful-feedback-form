import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Star, TrendingUp, Users, Award, CalendarIcon, Filter, LogOut, Download } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import {
  getFeedback,
  getRatingDistribution,
  getRatingsOverTime,
  getFilteredStats,
  getFilteredRatingDistribution,
  type Feedback,
  type DashboardStats,
  type RatingDistribution,
  type RatingsOverTime,
  type FeedbackFilters,
} from "@/lib/api";
import LoadingIndicator from "@/components/LoadingIndicator";
import { exportToCSV, exportToPDF } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";

const chartConfig = {
  avg_rating: {
    label: "Average Rating",
    color: "hsl(var(--primary))",
  },
  count: {
    label: "Reviews",
    color: "hsl(var(--primary))",
  },
};

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Refs for chart elements
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);

  // Filters state
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFeedback, setRecentFeedback] = useState<Feedback[]>([]);
  const [ratingDist, setRatingDist] = useState<RatingDistribution[]>([]);
  const [ratingsTime, setRatingsTime] = useState<RatingsOverTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Fetch data based on filters
  useEffect(() => {
    fetchData();
  }, [dateRange, ratingFilter]);

  const fetchData = async () => {
    setLoading(true);

    // Build filters
    const filters: FeedbackFilters = {
      startDate: dateRange.from,
      endDate: dateRange.to,
      limit: 10,
    };

    // Apply rating filters
    if (ratingFilter === "4-5") {
      filters.minRating = 4;
      filters.maxRating = 5;
    } else if (ratingFilter === "1-3") {
      filters.minRating = 1;
      filters.maxRating = 3;
    } else if (ratingFilter !== "all") {
      const rating = parseInt(ratingFilter);
      filters.minRating = rating;
      filters.maxRating = rating;
    }

    // Fetch all data in parallel
    const [statsData, feedbackData, ratingDistData, ratingsTimeData] = await Promise.all([
      getFilteredStats(filters),
      getFeedback(filters),
      getFilteredRatingDistribution(filters),
      getRatingsOverTime(),
    ]);

    setStats(statsData);
    setRecentFeedback(feedbackData);
    setRatingDist(ratingDistData);
    setRatingsTime(ratingsTimeData);
    setLoading(false);
  };

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setRatingFilter("all");
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const handleExportCSV = () => {
    if (recentFeedback.length === 0) {
      toast({
        title: "No Data",
        description: "There is no feedback data to export.",
        variant: "destructive",
      });
      return;
    }

    exportToCSV(recentFeedback);
    toast({
      title: "Export Successful",
      description: "Feedback data has been exported to CSV.",
    });
  };

  const handleExportPDF = async () => {
    if (recentFeedback.length === 0) {
      toast({
        title: "No Data",
        description: "There is no feedback data to export.",
        variant: "destructive",
      });
      return;
    }

    setExporting(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your report...",
    });

    try {
      await exportToPDF(
        recentFeedback,
        stats,
        ratingDist,
        {
          lineChart: lineChartRef.current || undefined,
          barChart: barChartRef.current || undefined,
        }
      );

      toast({
        title: "Export Successful",
        description: "Report has been exported to PDF with charts and branding.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
      console.error('PDF export error:', error);
    } finally {
      setExporting(false);
    }
  };

  // Format data for charts
  const chartRatingDist = ratingDist.map((item) => ({
    stars: `${item.rating} ★`,
    count: item.count,
  }));

  const chartRatingsTime = ratingsTime.map((item) => ({
    date: format(new Date(item.month), "MMM yyyy"),
    avgRating: item.avg_rating,
  }));

  if (loading) {
    return <LoadingIndicator message="Loading dashboard data..." autoHide={false} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Rating Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track customer satisfaction over time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <NavLink to="/">
              <span className="text-primary hover:text-primary/80 transition-colors">
                ← Back to Feedback Form
              </span>
            </NavLink>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3">
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleExportCSV}
            disabled={loading || recentFeedback.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleExportPDF}
            disabled={loading || recentFeedback.length === 0 || exporting}
          >
            <Download className="h-4 w-4" />
            {exporting ? "Generating..." : "Export PDF"}
          </Button>
        </div>

        {/* Filters Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Filters</CardTitle>
            </div>
            <CardDescription>Refine your analytics view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              {/* Date Range Picker */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Rating Filter */}
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Filter by Rating</label>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars Only</SelectItem>
                    <SelectItem value="4">4 Stars Only</SelectItem>
                    <SelectItem value="3">3 Stars Only</SelectItem>
                    <SelectItem value="2">2 Stars Only</SelectItem>
                    <SelectItem value="1">1 Star Only</SelectItem>
                    <SelectItem value="4-5">4-5 Stars (Positive)</SelectItem>
                    <SelectItem value="1-3">1-3 Stars (Needs Improvement)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <Button
                variant="secondary"
                onClick={handleResetFilters}
                className="md:self-end"
              >
                Reset Filters
              </Button>
            </div>

            {/* Active Filters Display */}
            {(dateRange.from || ratingFilter !== "all") && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {dateRange.from && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {dateRange.to
                      ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`
                      : format(dateRange.from, "MMM dd, yyyy")}
                  </span>
                )}
                {ratingFilter !== "all" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {ratingFilter === "4-5" ? "Positive Reviews" :
                     ratingFilter === "1-3" ? "Needs Improvement" :
                     `${ratingFilter} Star${ratingFilter === "1" ? "" : "s"}`}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-card border-border hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reviews
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats?.total_reviews || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {dateRange.from ? "In selected range" : "All time"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-primary fill-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.average_rating?.toFixed(1) || "0.0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                5-Star Reviews
              </CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats?.five_star_percentage?.toFixed(0) || "0"}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Of all reviews</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trend
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${(stats?.trend || 0) >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {(stats?.trend || 0) >= 0 ? '+' : ''}{stats?.trend?.toFixed(1) || "0.0"}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Recent trend</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Rating Trend</CardTitle>
              <CardDescription>Average rating over time</CardDescription>
            </CardHeader>
            <CardContent ref={lineChartRef}>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartRatingsTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      domain={[0, 5]}
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="avgRating"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Rating Distribution</CardTitle>
              <CardDescription>Number of reviews by star rating</CardDescription>
            </CardHeader>
            <CardContent ref={barChartRef}>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartRatingDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="stars"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reviews */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Feedback</CardTitle>
            <CardDescription>Most recent customer comments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentFeedback.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No feedback found matching your filters.
              </p>
            ) : (
              recentFeedback.map((review, index) => (
                <div
                  key={review.id}
                  className="border-b border-border last:border-0 pb-4 last:pb-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {review.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.location || "Unknown"} • {format(new Date(review.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  {review.feedback && (
                    <p className="text-sm text-muted-foreground italic">
                      "{review.feedback}"
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
