import Image from "next/image";

import { Link } from "@/lib/i18n/navigation";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
  priority,
}: {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={SITE_NAME}
      className={cn(
        "inline-flex shrink-0 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-brand-pink/50",
        className,
      )}
    >
      <Image
        src="/images/logo.png"
        alt={SITE_NAME}
        width={344}
        height={98}
        priority={priority}
        sizes="180px"
        className={cn("h-11 w-auto sm:h-12", imageClassName)}
      />
    </Link>
  );
}
