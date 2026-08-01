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

/** Cream banner with a mascot cut-out shared by the inner pages. */
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
      <Container className="relative grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[1.1fr_1fr] lg:py-20">
        <div>
          <h1 className="text-4xl font-extrabold text-brand-ink sm:text-5xl lg:text-[3.4rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-base text-brand-ink/60 sm:text-lg">
            {subtitle}
          </p>
        </div>

        <div className="relative mx-auto h-48 w-full max-w-sm sm:h-64 md:h-72 lg:h-80">
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
