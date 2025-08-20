"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip, BarChart, XAxis, YAxis, Bar } from "recharts";
import { Mail, Phone, MapPin, CalendarDays, Users, User, Clock, ShieldCheck, LayoutDashboard } from "lucide-react";
import { data } from "@/context/data";

/**
 * Branch Dashboard Types — align with your API response
 */
export type OperatingHour = {
  day: string; // Monday, Tuesday, ...
  open: string; // "06:00 AM"
  close: string; // "10:00 PM"
  isOpen: boolean;
  _id: string;
};

export type Member = {
  _id: string;
  profilepic?: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pinCode?: string | number;
    };
    email?: string;
    mobileNumberMain?: string;
    alternateMobile?: string;
    physicalStats?: { weightKg?: number; heightCm?: number };
  };
  membershipInfo?: {
    membershiptype?: string;
    duration?: string;
    preferredStartDate?: string;
    specialRequests?: string;
    classInterests?: string[];
  };
  emergencyContactInfo?: {
    fullName?: string;
    relationship?: string;
    mobileNumber?: string;
  };
  paymentDetails?: string[];
  branch?: string;
  createdBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
};

export type Staff = { _id: string; firstName: string; jobTitle: string };

export type BranchDashboardData = {
  _id: string;
  name: string;
  location: {
    adreessline1?: string; // note: typo in API retained for compatibility
    addressline2?: string;
    city?: string;
    state?: string;
    pinCode?: string | number;
    country?: string;
  };
  contact?: { mobile?: string; phone?: string; email?: string };
  operatingHours: OperatingHour[];
  createdAt?: string;
  staffCount?: number;
  activeMemberCount?: number;
  membershipBreakdown?: Record<string, number>;
  recentMembers: Member[];
  monthlyExpenseTotal?: number;
  staffList?: Staff[];
};

export type BranchDashboardResponse = {
  statusCode: number;
  data: BranchDashboardData;
  message: string;
  success: boolean;
};

/** Utility helpers */
const formatAddress = (loc: BranchDashboardData["location"]) => {
  const bits = [loc.adreessline1, loc.addressline2, loc.city, loc.state, loc.pinCode, loc.country].filter(Boolean);
  return bits.join(", ");
};

const timeToMinutes = (time12: string) => {
  // expects e.g. "06:00 AM" / "10:00 PM"
  const [hhmm, meridiem] = time12.trim().split(" ");
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (meridiem?.toUpperCase() === "PM" && h !== 12) h += 12;
  if (meridiem?.toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + m;
};

const getTodayOpenState = (hours: OperatingHour[], now = new Date()) => {
  // Derive local day name (e.g., "Monday") in user's locale/timezone
  const today = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now);
  const rec = hours.find((h) => h.day.toLowerCase() === today.toLowerCase());
  if (!rec || !rec.isOpen) {
    return { isOpenNow: false, todayLabel: `${today}: Closed` };
  }
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const openM = timeToMinutes(rec.open);
  const closeM = timeToMinutes(rec.close);
  const isOpenNow = nowMins >= openM && nowMins <= closeM;
  return { isOpenNow, todayLabel: `${today}: ${rec.open} – ${rec.close}` };
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Small UI primitives */
const KpiCard: React.FC<{ title: string; value: React.ReactNode; icon?: React.ReactNode; hint?: string }> = ({
  title,
  value,
  icon,
  hint,
}) => (
  <Card className="rounded-2xl shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

/**
 * Dashboard Component
 */

export default function BranchDashboard({ data }: { data: BranchDashboardData }) {
  const { isOpenNow, todayLabel } = getTodayOpenState(data.operatingHours);

  const membershipPie = Object.entries(data.membershipBreakdown || {}).map(([name, value]) => ({ name, value }));

  // Group recent members by createdAt date (YYYY-MM-DD) for a tiny bar chart
  const byDay = data.recentMembers.reduce<Record<string, number>>((acc, m) => {
    const d = new Date(m.createdAt);
    const key = d.toISOString().slice(0, 10);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const recentBars = Object.entries(byDay)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, count]) => ({ date, count }));

  const address = formatAddress(data.location);

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5" />
              <h1 className="text-2xl md:text-3xl font-semibold">{data.name}</h1>
              <Badge variant={isOpenNow ? "default" : "secondary"} className={isOpenNow ? "bg-green-600" : ""}>
                {isOpenNow ? "Open now" : "Closed"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {address || "—"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> {todayLabel}
            </p>
          </div>

          {/* Quick contact */}
          <div className="flex flex-col gap-2 md:items-end">
            <div className="flex items-center gap-3">
              {data.contact?.phone && (
                <a href={`tel:${data.contact.phone}`} className="text-sm inline-flex items-center gap-1 hover:underline">
                  <Phone className="h-4 w-4" /> {data.contact.phone}
                </a>
              )}
              {data.contact?.mobile && (
                <a href={`tel:${data.contact.mobile}`} className="text-sm inline-flex items-center gap-1 hover:underline">
                  <Phone className="h-4 w-4" /> {data.contact.mobile}
                </a>
              )}
              {data.contact?.email && (
                <a href={`mailto:${data.contact.email}`} className="text-sm inline-flex items-center gap-1 hover:underline">
                  <Mail className="h-4 w-4" /> {data.contact.email}
                </a>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              Created {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Active Members" value={data.activeMemberCount ?? 0} icon={<Users className="h-4 w-4" />} />
          <KpiCard title="Staff" value={data.staffCount ?? data.staffList?.length ?? 0} icon={<User className="h-4 w-4" />} />
          <KpiCard
            title="Membership Types"
            value={Object.keys(data.membershipBreakdown || {}).length}
            icon={<ShieldCheck className="h-4 w-4" />}
          />
          <KpiCard title="Monthly Expenses" value={`₹${(data.monthlyExpenseTotal ?? 0).toLocaleString()}`} icon={<CalendarDays className="h-4 w-4" />} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-6 xl:col-span-2">
            {/* Recent Members */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>Newest sign-ups and their plan details.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-3">
                  <Input placeholder="Search member by name, email, or phone…" className="max-w-sm" />
                </div>
                <ScrollArea className="h-[320px] rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Membership</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentMembers.map((m) => {
                        const fullName = `${m.personalInfo.firstName} ${m.personalInfo.lastName}`.trim();
                        return (
                          <TableRow key={m._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>{initials(fullName || "M")}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">{fullName || "—"}</span>
                                  <span className="text-xs text-muted-foreground">{m.personalInfo.gender || ""}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                {m.personalInfo.email ? (
                                  <a className="text-sm hover:underline" href={`mailto:${m.personalInfo.email}`}>{m.personalInfo.email}</a>
                                ) : (
                                  <span className="text-sm">—</span>
                                )}
                                <span className="text-xs text-muted-foreground">{m.personalInfo.mobileNumberMain || ""}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{m.membershipInfo?.membershiptype || "—"}</Badge>
                                <span className="text-xs text-muted-foreground">{m.membershipInfo?.duration || ""}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={m.isActive ? "bg-green-600" : ""}>{m.isActive ? "Active" : "Inactive"}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{new Date(m.createdAt).toLocaleString()}</span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
                <CardDescription>Weekly schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Open</TableHead>
                      <TableHead>Close</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.operatingHours.map((h) => (
                      <TableRow key={h._id}>
                        <TableCell className="font-medium">{h.day}</TableCell>
                        <TableCell>{h.isOpen ? h.open : "—"}</TableCell>
                        <TableCell>{h.isOpen ? h.close : "—"}</TableCell>
                        <TableCell>
                          <Badge variant={h.isOpen ? "default" : "secondary"} className={h.isOpen ? "bg-green-600" : ""}>
                            {h.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Membership Breakdown */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Membership Breakdown</CardTitle>
                <CardDescription>Share of members by plan</CardDescription>
              </CardHeader>
              <CardContent>
                {membershipPie.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No membership data.</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie dataKey="value" data={membershipPie} outerRadius={96} label>
                          {membershipPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                          ))}
                        </Pie>
                        <ReTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-2">
                  {membershipPie.map((m) => (
                    <div key={m.name} className="flex items-center justify-between">
                      <span className="text-sm">{m.name}</span>
                      <Badge variant="secondary">{m.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sign-ups (last few days) */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Recent Sign-ups</CardTitle>
                <CardDescription>Members added per day</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBars.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent members.</p>
                ) : (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={recentBars}>
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} width={28} />
                        <ReTooltip />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Staff */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Staff</CardTitle>
                <CardDescription>People who keep the gym running</CardDescription>
              </CardHeader>
              <CardContent>
                {!(data.staffList && data.staffList.length) ? (
                  <p className="text-sm text-muted-foreground">No staff listed.</p>
                ) : (
                  <div className="space-y-3">
                    {data.staffList?.map((s) => (
                      <div key={s._id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{initials(s.firstName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{s.firstName}</span>
                            <span className="text-xs text-muted-foreground">{s.jobTitle}</span>
                          </div>
                        </div>
                        <Badge variant="outline">ID: {s._id.slice(-6)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact quick actions */}
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Contact & Location</CardTitle>
                <CardDescription>Reach out or navigate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {address && (
                  <a
                    className="inline-flex items-center gap-2 hover:underline"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin className="h-4 w-4" /> View on Maps
                  </a>
                )}
                {data.contact?.email && (
                  <div>
                    <a className="inline-flex items-center gap-2 hover:underline" href={`mailto:${data.contact.email}`}>
                      <Mail className="h-4 w-4" /> {data.contact.email}
                    </a>
                  </div>
                )}
                {data.contact?.mobile && (
                  <div>
                    <a className="inline-flex items-center gap-2 hover:underline" href={`tel:${data.contact.mobile}`}>
                      <Phone className="h-4 w-4" /> {data.contact.mobile}
                    </a>
                  </div>
                )}
                {data.contact?.phone && (
                  <div>
                    <a className="inline-flex items-center gap-2 hover:underline" href={`tel:${data.contact.phone}`}>
                      <Phone className="h-4 w-4" /> {data.contact.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom: Raw data & tabs (optional) */}
        {/* <Tabs defaultValue="json" className="mt-4">
          <TabsList>
            <TabsTrigger value="json">Raw JSON</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <pre className="text-xs bg-muted rounded-xl p-4 overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </TabsContent>
          <TabsContent value="hours">
            <div className="text-sm text-muted-foreground">{todayLabel}</div>
          </TabsContent>
        </Tabs> */}
      </div>
    </TooltipProvider>
  );
}

/**
 * Example usage (remove in production):
 *
 * import BranchDashboard from "./BranchDashboard";
 *
 * export default function Page() {
 *   const apiResponse: BranchDashboardResponse = YOUR_FETCHED_DATA;
 *   return <BranchDashboard data={apiResponse.data} />;
 * }
 */
