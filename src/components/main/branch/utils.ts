import type { Location as BranchLocation, OperatingHour } from "@/types/branch";


export const TZ = "Asia/Kolkata"; // make a prop if branches span timezones


export function getLine1(loc: BranchLocation) {
return loc.adreessline1 || loc.addressline2 || "";
}


export function formatAddress(loc: BranchLocation) {
const line1 = getLine1(loc);
const line2 = loc.addressline2 ? `, ${loc.addressline2}` : "";
const pin = loc.pinCode != null ? ` ${String(loc.pinCode)}` : "";
return `${line1}${line2}, ${loc.city}, ${loc.state}${pin}, ${loc.country}`;
}


export function mapUrlFor(loc: BranchLocation) {
const q = encodeURIComponent(formatAddress(loc));
return `https://www.google.com/maps/search/?api=1&query=${q}`;
}


export function parse12hToMinutes(label: string): number | null {
if (!label) return null;
const parts = label.trim().split(" ").filter(Boolean);
if (parts.length < 2) return null;
const [time = "", mer = ""] = parts;
if (!time || !mer) return null;
const [hStr, mStr] = time.split(":");
let h = Number(hStr);
const m = Number(mStr);
if (Number.isNaN(h) || Number.isNaN(m)) return null;
const merU = mer.toUpperCase();
if (merU === "PM" && h !== 12) h += 12;
if (merU === "AM" && h === 12) h = 0;
return h * 60 + m;
}


export function getNowMinutesInTZ(timeZone: string): number {
const now = new Date();
const hhmm = new Intl.DateTimeFormat("en-GB", {
hour: "2-digit",
minute: "2-digit",
hour12: false,
timeZone,
}).format(now);
const [hhRaw, mmRaw] = hhmm.split(":");
const hhNum = Number(hhRaw ?? "0");
const mmNum = Number(mmRaw ?? "0");
const hh = Number.isNaN(hhNum) ? 0 : hhNum;
const mm = Number.isNaN(mmNum) ? 0 : mmNum;
return hh * 60 + mm;
}


export function isOpenNow(today: OperatingHour | undefined): {
open: boolean;
closesAt?: string;
opensAt?: string;
} {
if (!today || !today.isOpen) {
  return today?.open ? { open: false, opensAt: today.open } : { open: false };
}
const openMin = parse12hToMinutes(today.open ?? "");
const closeMin = parse12hToMinutes(today.close ?? "");
if (openMin == null || closeMin == null) return { open: false };
const nowMin = getNowMinutesInTZ(TZ);
if (closeMin <= openMin) {
const openNow = nowMin >= openMin || nowMin < closeMin; // crosses midnight
return openNow ? { open: true, closesAt: today.close } : { open: false, opensAt: today.open };
}
const openNow = nowMin >= openMin && nowMin < closeMin;
return openNow ? { open: true, closesAt: today.close } : { open: false, opensAt: today.open };
}


export function getTodayName(timeZone = TZ) {
return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(new Date());
}