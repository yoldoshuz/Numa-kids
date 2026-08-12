import Image from "next/image";

import { Container } from "@/components/shared/container";
import { Sparkles } from "@/components/shared/sparkles";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle: string;
  /** One cut-out, or a small cast standing side by side. */
  image: string | string[];
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
  const cast = Array.isArray(image) ? image : [image];

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

        {/*
          Each cut-out gets its own equal share of the strip and is contained
          within it, so a second mascot narrows the pair rather than pushing the
          banner wider — the row has to survive a 375px phone.
        */}
        <div className="mx-auto flex h-32 w-full max-w-xs items-end justify-center gap-2 sm:h-40 md:h-44 lg:h-48">
          {cast.map((src, index) => (
            <div key={src} className="relative h-full min-w-0 flex-1">
              <Image
                src={src}
                alt={index === 0 ? imageAlt : ""}
                fill
                priority
                sizes="(max-width: 768px) 70vw, 380px"
                className={cn("animate-float object-contain", imageClassName)}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
