import React from "react";

/**
 * Reusable BranchInfoCard
 * - Pure React + Tailwind (drop-in for Next.js / CRA)
 * - No external UI libs required
 * - Strongly typed props
 * - Handles misspelt key `adreessline1` gracefully
 * - Shows: Name, Location (with Google Maps link), Contact (click-to-call/email),
 *   Operating Hours (weekly) + live "Open now" status using Asia/Kolkata timezone.
 * - Variants: "card" | "inline" | "minimal"
 */

// ===================== Types =====================
export type OperatingHour = {
  day: string; // e.g., "Monday"
  open: string; // e.g., "06:00 AM"
  close: string; // e.g., "10:00 PM"
  isOpen: boolean;
  _id?: string;
};

export type BranchLocation = {
  // The payload sometimes has a typo: "adreessline1"
  adreessline1?: string; // typo key from backend
  addressline1?: string; // corrected key (supported too)
  addressline2?: string;
  city: string;
  state: string;
  pinCode: string | number;
  country: string;
};

export type BranchContact = {
  mobile?: string;
  phone?: string;
  email?: string;
};

export type BranchInfo = {
  name: string;
  location: BranchLocation;
  contact: BranchContact;
  operatingHours: OperatingHour[];
};

export type BranchInfoCardProps = {
  data: BranchInfo;
  /** Layout preset */
  variant?: "card" | "inline" | "minimal";
  /** Show Google Maps link under the address */
  showMapLink?: boolean;
  /** Render the full weekly table of hours */
  showWeeklyHours?: boolean;
  /** Optional extra CSS classes */
  className?: string;
};

// ===================== Helpers =====================
const TZ = "Asia/Kolkata"; // Feel free to make this a prop if branches span timezones

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getLine1(loc: BranchLocation) {
  return loc.addressline1 || loc.adreessline1 || "";
}

function formatAddress(loc: BranchLocation) {
  const line1 = getLine1(loc);
  const line2 = loc.addressline2 ? `, ${loc.addressline2}` : "";
  const pin = loc.pinCode != null ? ` ${String(loc.pinCode)}` : "";
  return `${line1}${line2}, ${loc.city}, ${loc.state}${pin}, ${loc.country}`;
}

function mapUrlFor(loc: BranchLocation) {
  const q = encodeURIComponent(formatAddress(loc));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function parse12hToMinutes(label: string): number | null {
  // Accepts formats like "06:00 AM" or "6:00 am"
  if (!label) return null;
  const parts = label.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const [time, mer] = parts;
  const [hStr, mStr] = time.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  const merU = mer.toUpperCase();
  if (merU === "PM" && h !== 12) h += 12;
  if (merU === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

function getNowMinutesInTZ(timeZone: string): number {
  const now = new Date();
  const hhmm = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(now);
  const [hh, mm] = hhmm.split(":").map((n) => Number(n));
  return hh * 60 + mm;
}

function isOpenNow(today: OperatingHour | undefined): {
  open: boolean;
  closesAt?: string;
  opensAt?: string;
} {
  if (!today || !today.isOpen) return { open: false, opensAt: today?.open };
  const openMin = parse12hToMinutes(today.open ?? "");
  const closeMin = parse12hToMinutes(today.close ?? "");
  if (openMin == null || closeMin == null) return { open: false };
  const nowMin = getNowMinutesInTZ(TZ);
  // Handle ranges that might cross midnight (rare but safe)
  if (closeMin <= openMin) {
    // Example: 8 PM – 2 AM
    const openNow = nowMin >= openMin || nowMin < closeMin;
    return openNow ? { open: true, closesAt: today.close } : { open: false, opensAt: today.open };
  }
  const openNow = nowMin >= openMin && nowMin < closeMin;
  return openNow ? { open: true, closesAt: today.close } : { open: false, opensAt: today.open };
}

function getTodayName(timeZone = TZ) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(new Date());
}

// ===================== UI Primitives (Tailwind) =====================
const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div className={cx("rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-5 shadow-sm", className)}>{children}</div>
);

const SectionTitle: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <h4 className={cx("text-sm font-semibold uppercase tracking-wide text-zinc-400", className)}>{children}</h4>
);

const Badge: React.FC<React.PropsWithChildren<{ tone?: "success" | "danger" | "neutral"; className?: string }>> = ({ tone = "neutral", className, children }) => {
  const tones: Record<string, string> = {
    success: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
    danger: "bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30",
    neutral: "bg-zinc-700/40 text-zinc-300 ring-1 ring-zinc-600/60",
  };
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs", tones[tone], className)}>{children}</span>;
};

const Row: React.FC<React.PropsWithChildren<{ label?: string }>> = ({ label, children }) => (
  <div className="grid grid-cols-[8rem_1fr] items-baseline gap-3 py-1.5">
    <div className="text-zinc-400 text-sm">{label}</div>
    <div className="text-zinc-100">{children}</div>
  </div>
);

const LinkA: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ className, children, ...rest }) => (
  <a className={cx("underline-offset-2 hover:underline text-blue-400", className)} {...rest}>
    {children}
  </a>
);

// ===================== Main Component =====================
export const BranchInfoCard: React.FC<BranchInfoCardProps> = ({
  data,
  variant = "card",
  showMapLink = true,
  showWeeklyHours = true,
  className,
}) => {
  const todayName = getTodayName();
  const today = data.operatingHours?.find((d) => d.day.toLowerCase() === todayName.toLowerCase());
  const status = isOpenNow(today);

  const address = formatAddress(data.location);
  const mapLink = mapUrlFor(data.location);
  const phone = data.contact.phone || data.contact.mobile;

  const statusBadge = (
    <Badge tone={status.open ? "success" : "danger"}>
      {status.open ? (
        <>
          <span className="h-2 w-2 rounded-full bg-current inline-block" /> Open now{status.closesAt ? ` · until ${status.closesAt}` : ""}
        </>
      ) : (
        <>
          <span className="h-2 w-2 rounded-full bg-current inline-block" /> Closed now{status.opensAt ? ` · opens ${status.opensAt}` : ""}
        </>
      )}
    </Badge>
  );

  // ====== Layouts ======
  if (variant === "minimal") {
    return (
      <div className={cx("flex flex-col gap-1", className)}>
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-white">{data.name}</h3>
          {statusBadge}
        </div>
        <div className="text-zinc-300">{address}</div>
        <div className="text-zinc-300">
          {phone && (
            <>
              <LinkA href={`tel:${phone}`}>{phone}</LinkA>
              {data.contact.email ? <span className="mx-2">·</span> : null}
            </>
          )}
          {data.contact.email && <LinkA href={`mailto:${data.contact.email}`}>{data.contact.email}</LinkA>}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cx("grid grid-cols-1 gap-6 md:grid-cols-3", className)}>
        <div>
          <h3 className="text-xl font-semibold text-white">{data.name}</h3>
          <div className="mt-1">{statusBadge}</div>
        </div>
        <div>
          <SectionTitle>Location</SectionTitle>
          <div className="mt-1 text-zinc-200">{address}</div>
          {showMapLink && (
            <div className="mt-1">
              <LinkA href={mapLink} target="_blank" rel="noreferrer">View on Maps</LinkA>
            </div>
          )}
        </div>
        <div>
          <SectionTitle>Contact</SectionTitle>
          <div className="mt-1 space-x-2 text-zinc-200">
            {phone && (
              <LinkA href={`tel:${phone}`}>
                {phone}
              </LinkA>
            )}
            {data.contact.email && (
              <>
                <span>·</span>
                <LinkA href={`mailto:${data.contact.email}`}>{data.contact.email}</LinkA>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // default: card
  return (
    <Card className={className}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold text-white">{data.name}</h3>
            <div className="mt-2">{statusBadge}</div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Location */}
          <div>
            <SectionTitle>Location</SectionTitle>
            <div className="mt-2 text-zinc-200">{address}</div>
            {showMapLink && (
              <div className="mt-2">
                <LinkA href={mapLink} target="_blank" rel="noreferrer">View on Maps</LinkA>
              </div>
            )}
          </div>

          {/* Contact */}
          <div>
            <SectionTitle>Contact</SectionTitle>
            <div className="mt-2 space-y-1 text-zinc-200">
              {data.contact.mobile && (
                <div>
                  <span className="text-zinc-400 mr-2">Mobile:</span>
                  <LinkA href={`tel:${data.contact.mobile}`}>{data.contact.mobile}</LinkA>
                </div>
              )}
              {data.contact.phone && (
                <div>
                  <span className="text-zinc-400 mr-2">Phone:</span>
                  <LinkA href={`tel:${data.contact.phone}`}>{data.contact.phone}</LinkA>
                </div>
              )}
              {data.contact.email && (
                <div>
                  <span className="text-zinc-400 mr-2">Email:</span>
                  <LinkA href={`mailto:${data.contact.email}`}>{data.contact.email}</LinkA>
                </div>
              )}
            </div>
          </div>

          {/* Today */}
          <div>
            <SectionTitle>Today ({todayName})</SectionTitle>
            <div className="mt-2 text-zinc-200">
              {today?.isOpen ? (
                <span>
                  {today.open} – {today.close}
                </span>
              ) : (
                <span>Closed</span>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Hours */}
        {showWeeklyHours && (
          <div>
            <SectionTitle>Operating Hours</SectionTitle>
            <div className="mt-2 overflow-hidden rounded-xl border border-zinc-800/60">
              <table className="min-w-full divide-y divide-zinc-800">
                <tbody className="divide-y divide-zinc-800">
                  {data.operatingHours?.map((d) => {
                    const isToday = d.day.toLowerCase() === todayName.toLowerCase();
                    return (
                      <tr key={d._id ?? d.day} className={cx(isToday && "bg-zinc-800/30")}> 
                        <td className="px-4 py-2 text-sm text-zinc-300 w-40">{d.day}</td>
                        <td className="px-4 py-2 text-sm text-zinc-100">
                          {d.isOpen ? (
                            <span>
                              {d.open} – {d.close}
                            </span>
                          ) : (
                            <span className="text-zinc-400">Closed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
