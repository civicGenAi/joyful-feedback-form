// MOBILE OPTIMIZATION GUIDE FOR DASHBOARD

// 1. RESPONSIVE GRID FOR STATS CARDS
// Current:
// <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

// Optimized for mobile:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

// Reason: Better spacing on tablets, reduces gap on mobile


// 2. RESPONSIVE CHARTS WITH BETTER SIZING
// Current Chart Structure:
{/* Line Chart */}
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle>Rating Trend</CardTitle>
  </CardHeader>
  <CardContent ref={lineChartRef}>
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartRatingsTime}>

// Optimized for mobile:
{/* Line Chart */}
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-base sm:text-lg">Rating Trend</CardTitle>
  </CardHeader>
  <CardContent ref={lineChartRef} className="overflow-x-auto">
    <div className="w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
      <ChartContainer config={chartConfig} className="w-full h-[250px] sm:h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%" debounce={200}>
          <LineChart data={chartRatingsTime} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>

// Reason: 
// - Responsive title size
// - Scrollable on mobile if needed
// - Height adapts to screen size
// - Left margin adjusted to save space on mobile
// - Debounce prevents resize spam


// 3. RESPONSIVE FILTER SECTION
// Current:
<div className="flex flex-col md:flex-row gap-4 items-start md:items-end">

// Optimized:
<div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row gap-2 sm:gap-3 md:gap-4 items-start sm:items-end">

// Add to each filter input:
className="w-full sm:flex-1"

// Reason: Better use of space on tablets, proper stacking on mobile


// 4. RESPONSIVE BUTTONS
// Current Export buttons:
<div className="flex gap-3">
  <Button...>Export CSV</Button>
  <Button...>Export PDF</Button>
</div>

// Optimized:
<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
  <Button className="flex-1 sm:flex-none text-xs sm:text-sm">
    <Download className="h-4 w-4" />
    <span className="hidden xs:inline">Export CSV</span>
    <span className="xs:hidden">CSV</span>
  </Button>
  <Button className="flex-1 sm:flex-none text-xs sm:text-sm">
    <Download className="h-4 w-4" />
    <span className="hidden xs:inline">Export PDF</span>
    <span className="xs:hidden">PDF</span>
  </Button>
</div>

// Reason: Full width on mobile, inline on desktop, shorter labels on very small screens


// 5. RESPONSIVE HEADER
// Current:
<div className="flex items-center justify-between">
  <div>
    <h1 className="text-4xl font-bold">Rating Analytics Dashboard</h1>
    <p className="text-muted-foreground">Track customer satisfaction...</p>
  </div>
  <div className="flex items-center gap-3">
    <Button>Logout</Button>
    <NavLink>← Back</NavLink>
  </div>
</div>

// Optimized:
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-3">
  <div className="flex-1">
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
      Rating Analytics
    </h1>
    <p className="text-xs sm:text-sm text-muted-foreground">Track customer satisfaction</p>
  </div>
  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-col sm:flex-row">
    <Button 
      variant="outline" 
      size="sm"
      className="w-full sm:w-auto text-xs sm:text-sm"
      onClick={handleLogout}
    >
      <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
      <span className="hidden xs:inline">Logout</span>
    </Button>
    <NavLink className="text-xs sm:text-sm w-full sm:w-auto">
      ← Back to Feedback
    </NavLink>
  </div>
</div>

// Reason: Better hierarchy on mobile, responsive sizing, stacked layout


// 6. RESPONSIVE DATA TABLE
// For the feedback table that appears lower in dashboard, ensure:

// Add this wrapper if table exists:
<div className="overflow-x-auto -mx-4 sm:-mx-0">
  <div className="min-w-full sm:min-w-0">
    <Table>
      {/* table content */}
    </Table>
  </div>
</div>

// Reason: Allows horizontal scroll on mobile without page overflow


// 7. CALENDAR POPOVER RESPONSIVE FIX
// Current:
<PopoverContent className="w-auto p-0" align="start">
  <Calendar mode="range" numberOfMonths={2} />
</PopoverContent>

// Optimized:
<PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
  <Calendar 
    mode="range" 
    numberOfMonths={isMobile ? 1 : 2} 
    disabled={(date) => date > new Date()}
  />
</PopoverContent>

// Add hook for mobile detection:
// import { useIsMobile } from '@/hooks/use-mobile'
// const isMobile = useIsMobile()


// 8. GENERAL BREAKPOINT UTILITIES
// Add these to tailwind.config.ts extend section if not present:

{
  screens: {
    'xs': '375px',      // iPhone SE and small phones
    'sm': '640px',      // Current Tailwind small
    'md': '768px',      // Current Tailwind medium
    'lg': '1024px',     // Current Tailwind large
    'xl': '1280px',     // Current Tailwind xlarge
  }
}

// Usage:
<div className="text-xs xs:text-sm sm:text-base">Responsive text</div>


// IMPLEMENTATION PRIORITY:
// 1. HIGH: Charts responsive sizing (affects most users on mobile)
// 2. HIGH: Filter section responsive grid (used frequently)
// 3. MEDIUM: Header reorganization (visual improvement)
// 4. MEDIUM: Stats cards grid on mobile
// 5. MEDIUM: Export buttons responsive
// 6. LOW: Calendar popover optimization (less used feature)
// 7. LOW: Table scrolling (depends on data volume)


// TESTING CHECKLIST:
// [ ] Test charts render correctly on 375px width
// [ ] Test charts on 768px (iPad)
// [ ] Test filters fit properly on 640px
// [ ] Test buttons have adequate touch targets (44x44px minimum)
// [ ] Test export buttons on mobile (full width or stacked)
// [ ] Test data table horizontal scroll on 375px
// [ ] Test calendar popover on 375px (doesn't overflow)
// [ ] Test typography scaling across all breakpoints
// [ ] Test no horizontal scroll on main viewport
// [ ] Test touch targets for interactive elements
