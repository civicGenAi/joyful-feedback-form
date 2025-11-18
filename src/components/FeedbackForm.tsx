import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { playChime } from "@/lib/audio-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ThumbsUp, Smile, ThumbsDown, Star } from "lucide-react";

type Rating = "loved" | "okay" | "not-good" | null;

const FeedbackForm = () => {
  const [rating, setRating] = useState<Rating>(null);
  const [starRating, setStarRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ rating, starRating, name, location, feedback });
    
    // Trigger confetti for 5-star reviews
    if (starRating === 5) {
      triggerConfetti();
    }
    
    setSubmitted(true);
  };

  const triggerConfetti = () => {
    // Play celebratory chime
    playChime();
    
    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#377536', '#E9242B', '#FFD700', '#FFF'],
    });

    // Second burst with delay
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#377536', '#E9242B', '#FFD700', '#FFF'],
      });
    }, 200);

    // Third burst from right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#377536', '#E9242B', '#FFD700', '#FFF'],
      });
    }, 400);
  };

  const handleReset = () => {
    setRating(null);
    setStarRating(0);
    setName("");
    setLocation("");
    setFeedback("");
    setSubmitted(false);
  };

  useEffect(() => {
    // Trigger confetti when confirmation screen shows for 5-star reviews
    if (submitted && starRating === 5) {
      const timer = setTimeout(() => {
        triggerConfetti();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [submitted, starRating]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 md:p-12 text-center shadow-xl border-0 animate-fade-in">
          <div className="mb-6">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              starRating === 5 
                ? "bg-primary/20 animate-bounce-in" 
                : "bg-primary/10"
            }`}>
              <svg
                className="w-12 h-12 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {starRating === 5 ? "Thank you! 🎉" : "Thank you! 🥛"}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {starRating === 5 
              ? "We're thrilled you loved African Joy! Your amazing feedback helps us keep delivering excellence."
              : "Your feedback helps us make African Joy even better."
            }
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="w-full md:w-auto"
          >
            Submit Another Response
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated SVG Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {/* Milk drops animation */}
        <svg className="absolute top-10 left-10 w-16 h-16 text-primary animate-[float_6s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
        <svg className="absolute top-20 right-20 w-12 h-12 text-secondary animate-[float_8s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
        <svg className="absolute bottom-20 left-1/4 w-14 h-14 text-primary animate-[float_7s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
        </svg>
        
        {/* Dairy product icons */}
        <svg className="absolute top-1/3 right-10 w-20 h-20 text-primary animate-[spin_20s_linear_infinite]" viewBox="0 0 100 140" fill="none">
          <path d="M30 35 L30 120 Q30 130 40 130 L60 130 Q70 130 70 120 L70 35 Z" fill="currentColor" opacity="0.3"/>
          <rect x="40" y="20" width="20" height="15" fill="currentColor" opacity="0.4"/>
          <rect x="38" y="15" width="24" height="8" rx="2" fill="currentColor"/>
        </svg>
        
        {/* Floating hearts for positive vibe */}
        <svg className="absolute bottom-1/3 right-1/4 w-10 h-10 text-secondary animate-[pulse_3s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        
        {/* Star shapes */}
        <svg className="absolute top-1/2 left-10 w-12 h-12 text-primary animate-[spin_15s_linear_infinite]" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <Card className="max-w-2xl w-full p-6 md:p-10 shadow-xl border-0">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            How was your experience with African Joy Dairy?
          </h1>
          <p className="text-lg text-muted-foreground">
            Your feedback helps us improve our products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Rating */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Rate us with stars <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="flex items-center justify-center gap-2 p-6 bg-accent/30 rounded-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStarRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="group transition-transform duration-200 hover:scale-125 active:scale-110"
                >
                  <Star
                    className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-300 ${
                      star <= (hoveredStar || starRating)
                        ? "fill-primary text-primary scale-110 animate-pulse"
                        : "text-muted-foreground/30 hover:text-muted-foreground/50"
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            {starRating > 0 && (
              <p className="text-center text-sm font-medium text-primary animate-fade-in">
                You rated us {starRating} star{starRating !== 1 ? "s" : ""}! 
                {starRating === 5 && " ⭐ Amazing!"}
                {starRating === 4 && " 😊 Great!"}
                {starRating === 3 && " 👍 Good!"}
              </p>
            )}
          </div>

          {/* Rating Buttons */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground mb-4">
              Rate your experience
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setRating("loved")}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  rating === "loved"
                    ? "bg-primary border-primary shadow-lg animate-bounce-in animate-glow"
                    : "bg-white border-border hover:border-primary hover:shadow-md hover:scale-105"
                }`}
              >
                <ThumbsUp
                  className={`w-10 h-10 mx-auto mb-3 transition-all duration-300 ${
                    rating === "loved" 
                      ? "text-primary-foreground animate-bounce-in" 
                      : "text-primary"
                  }`}
                />
                <span
                  className={`block text-lg font-semibold transition-all duration-300 ${
                    rating === "loved" ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  Loved it
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRating("okay")}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  rating === "okay"
                    ? "bg-muted border-muted shadow-lg animate-bounce-in"
                    : "bg-white border-border hover:border-muted-foreground hover:shadow-md hover:scale-105"
                }`}
              >
                <Smile
                  className={`w-10 h-10 mx-auto mb-3 transition-all duration-300 ${
                    rating === "okay" 
                      ? "text-foreground animate-bounce-in" 
                      : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`block text-lg font-semibold transition-all duration-300 ${
                    rating === "okay" ? "text-foreground" : "text-foreground"
                  }`}
                >
                  It was okay
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRating("not-good")}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  rating === "not-good"
                    ? "bg-secondary border-secondary shadow-lg animate-bounce-in animate-glow-red"
                    : "bg-white border-border hover:border-secondary hover:shadow-md hover:scale-105"
                }`}
              >
                <ThumbsDown
                  className={`w-10 h-10 mx-auto mb-3 transition-all duration-300 ${
                    rating === "not-good" 
                      ? "text-secondary-foreground animate-bounce-in" 
                      : "text-secondary"
                  }`}
                />
                <span
                  className={`block text-lg font-semibold transition-all duration-300 ${
                    rating === "not-good" ? "text-secondary-foreground" : "text-foreground"
                  }`}
                >
                  Not good
                </span>
              </button>
            </div>
          </div>

          {/* Optional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Your name <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border-2"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-foreground">
                Your location <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Dar es Salaam, Arusha"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-12 rounded-xl border-2"
              />
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label htmlFor="feedback" className="block text-sm font-medium text-foreground">
              Tell us what we should improve <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-32 rounded-xl border-2 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!rating}
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Feedback
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FeedbackForm;
