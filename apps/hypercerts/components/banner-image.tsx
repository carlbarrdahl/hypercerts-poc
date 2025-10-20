import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

export function BannerImage({
  src,
  alt = "",
  size = "md",
  className,
}: {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-24 md:h-32 lg:h-40",
    md: "h-48 md:h-64 lg:h-72",
    lg: "h-96 md:h-128 lg:h-160",
  };
  return (
    <div
      className={cn("relative w-full overflow-hidden", sizes[size], className)}
    >
      {src ? (
        <img src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div className="bg-muted w-full h-full" />
      )}
    </div>
  );
}
