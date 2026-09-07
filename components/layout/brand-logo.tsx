import Image from "next/image";

import { Link } from "@/lib/i18n/navigation";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * The wordmark on its own, with no link around it.
 *
 * The brand switcher wraps the logo in a `<button>`, and an anchor inside a
 * button is invalid markup — the browser hands the click to the anchor, so the
 * logo navigated home instead of opening the group menu that is the whole point
 * of the control. Anything supplying its own interactive element takes this;
 * everything else takes `<BrandLogo>` below.
 */
export function BrandLogoMark({
  imageClassName,
  priority,
}: {
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/logo.png"
      alt={SITE_NAME}
      width={344}
      height={98}
      priority={priority}
      sizes="180px"
      className={cn("h-11 w-auto sm:h-12", imageClassName)}
    />
  );
}

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
      <BrandLogoMark imageClassName={imageClassName} priority={priority} />
    </Link>
  );
}
