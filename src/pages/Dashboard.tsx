import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Star, TrendingUp, Users, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { NavLink } from "@/components/NavLink";

// Mock data for ratings over time
const ratingsOverTime = [
  { date: "Jan", avgRating: 4.2 },
  { date: "Feb", avgRating: 4.5 },
  { date: "Mar", avgRating: 4.3 },
  { date: "Apr", avgRating: 4.7 },
  { date: "May", avgRating: 4.8 },
  { date: "Jun", avgRating: 4.9 },
];

// Mock data for rating distribution
const ratingDistribution = [
  { stars: "1 ★", count: 2 },
  { stars: "2 ★", count: 5 },
  { stars: "3 ★", count: 12 },
  { stars: "4 ★", count: 45 },
  { stars: "5 ★", count: 136 },
];

const chartConfig = {
  avgRating: {
    label: "Average Rating",
    color: "hsl(var(--primary))",
  },
  count: {
    label: "Reviews",
    color: "hsl(var(--primary))",
  },
};

const Dashboard = () => {
  const totalReviews = ratingDistribution.reduce((sum, item) => sum + item.count, 0);
  const avgRating = 4.9;
  const fiveStarPercentage = ((136 / totalReviews) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Rating Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track customer satisfaction over time
            </p>
          </div>
          <NavLink to="/">
            <span className="text-primary hover:text-primary/80 transition-colors">
              ← Back to Feedback Form
            </span>
          </NavLink>
        </div>

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
              <div className="text-3xl font-bold text-foreground">{totalReviews}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
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
              <div className="text-3xl font-bold text-foreground">{avgRating}</div>
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
              <div className="text-3xl font-bold text-foreground">{fiveStarPercentage}%</div>
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
              <div className="text-3xl font-bold text-primary">+0.7</div>
              <p className="text-xs text-muted-foreground mt-1">Since last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Rating Trend</CardTitle>
              <CardDescription>Average rating over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ratingsOverTime}>
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
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
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

        {/* Recent Reviews Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Feedback Highlights</CardTitle>
            <CardDescription>Most recent customer comments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "John M.", rating: 5, comment: "Excellent dairy products! The milk is always fresh.", location: "Nairobi" },
              { name: "Sarah K.", rating: 5, comment: "Best yogurt I've ever tasted. Will buy again!", location: "Mombasa" },
              { name: "David O.", rating: 4, comment: "Great quality, would love more variety though.", location: "Kisumu" },
            ].map((review, index) => (
              <div
                key={index}
                className="border-b border-border last:border-0 pb-4 last:pb-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
