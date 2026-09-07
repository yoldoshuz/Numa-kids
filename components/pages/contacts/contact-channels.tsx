import { Clock, Mail, MapPin, Smartphone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { InstagramIcon, TelegramIcon } from "@/components/shared/brand-icons";
import { CONTACTS, localizedAddress } from "@/lib/constants";
import { CONTACT_CHANNELS } from "@/lib/data";
import type { AppLocale } from "@/lib/i18n/routing";

const ICONS = {
  email: Mail,
  phone: Smartphone,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  address: MapPin,
  hours: Clock,
} as const;

const HIGHLIGHT = {
  email: "text-brand-pink",
  phone: "text-blue-badge",
  telegram: "text-blue-badge",
  instagram: "text-brand-pink",
  address: "text-brand-ink",
  hours: "text-brand-orange",
} as const;

export function ContactChannels() {
  const t = useTranslations("contacts.channels");
  const locale = useLocale() as AppLocale;

  const value = {
    email: CONTACTS.email,
    phone: CONTACTS.phone,
    telegram: CONTACTS.telegram,
    instagram: CONTACTS.instagram,
    address: localizedAddress(locale),
    hours: t("hours.extra"),
  } as const;

  const href = {
    email: CONTACTS.emailHref,
    phone: CONTACTS.phoneHref,
    telegram: CONTACTS.telegramHref,
    instagram: CONTACTS.instagramHref,
    address: undefined,
    hours: undefined,
  } as const;

  return (
    <ul className="grid gap-5">
      {CONTACT_CHANNELS.map((channel) => {
        const Icon = ICONS[channel.id];
        const link = href[channel.id];

        return (
          <li
            key={channel.id}
            className={`flex items-start gap-5 rounded-2xl p-6 ${channel.tint}`}
          >
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand-ink"
            >
              <Icon className="size-5" />
            </span>

            <div className="min-w-0">
              <h3 className="text-base font-bold text-brand-ink">
                {t(`${channel.id}.title`)}
              </h3>
              {t(`${channel.id}.text`) && (
                <p className="mt-1 text-sm text-brand-ink/60">
                  {t(`${channel.id}.text`)}
                </p>
              )}
              {link ? (
                <a
                  href={link}
                  target={link.startsWith("http") ? "_blank" : undefined}
                  rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`mt-1.5 block text-sm font-bold break-words ${HIGHLIGHT[channel.id]} hover:underline`}
                >
                  {value[channel.id]}
                </a>
              ) : (
                <p
                  className={`mt-1.5 text-sm font-bold ${HIGHLIGHT[channel.id]}`}
                >
                  {value[channel.id]}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
