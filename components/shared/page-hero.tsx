import Image from "next/image";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageClassName?: string;
}

/**
 * Cream banner with a mascot cut-out shared by the inner pages.
 *
 * Deliberately shallow: on a catalogue page the banner is a signpost, not the
 * subject, and the previous height pushed the product grid below the fold on
 * a laptop.
 */
export function PageHero({
  title,
  subtitle,
  image,
  imageAlt,
  imageClassName,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-cream">
      <Sparkles className="-z-0" />
      <Container className="relative grid items-center gap-6 py-7 sm:py-9 md:grid-cols-[1.2fr_1fr] lg:py-11">
        <div>
          <h1 className="text-3xl font-extrabold text-brand-ink sm:text-4xl lg:text-[2.6rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-md text-sm text-brand-ink/60 sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="relative mx-auto h-32 w-full max-w-xs sm:h-40 md:h-44 lg:h-48">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 70vw, 380px"
            className={cn("animate-float object-contain", imageClassName)}
          />
        </div>
      </Container>
    </section>
  );
}
