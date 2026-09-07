import { serializeJsonLd } from "@/lib/json-ld";

export function JsonLd({ data }: { data: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Escaped in `serializeJsonLd` to keep the payload XSS-safe.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
