import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  showEmpty?: boolean;
  className?: string;
}

export function StarRating({
  rating,
  maxStars = 5,
  showEmpty = true,
  className,
}: Readonly<StarRatingProps>) {
  if (!showEmpty) {
    return (
      <span
        className={cn("text-sm text-amber-400", className)}
        aria-label={`${rating} out of ${maxStars}`}
      >
        {Array.from({ length: rating }, () => "\u2605").join("")}
      </span>
    );
  }

  return (
    <span
      className={cn("flex gap-0.5", className)}
      aria-label={`${rating} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={`star-${i}-of-${maxStars}`}
          className={cn("text-sm", i < rating ? "text-amber-400" : "text-white/10")}
        >
          {"\u2605"}
        </span>
      ))}
    </span>
  );
}
