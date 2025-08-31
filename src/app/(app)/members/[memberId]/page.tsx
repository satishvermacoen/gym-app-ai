"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { useMember } from "@/hooks//members/useMember";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function initials(name?: string) {
  if (!name) return "M";
  return name.split(" ").map((p) => p[0]).join("").slice(0,2).toUpperCase();
}

export default function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>();
  const { data, isLoading } = useMember(memberId);

  if (isLoading) return <Skeleton className="h-[240px] w-full" />;

  const m: any = data ?? {};
  const name = m.name ?? `${m.fullName?.firstName ?? ""} ${m.fullName?.lastName ?? ""}`.trim();

  return (
    <div className="space-y-4">
      <Link href="/members" className="text-sm text-muted-foreground hover:underline">← Back to Members</Link>

      <Card>
        <CardHeader>
          <CardTitle>Member Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={m.avatarUrl} alt={name} />
              <AvatarFallback>{initials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-semibold">{name || "Member"}</div>
              <div className="text-sm text-muted-foreground">{m._id}</div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm">Email: <span className="text-muted-foreground">{m.email ?? "—"}</span></div>
            <div className="text-sm">Phone: <span className="text-muted-foreground">{m.phone ?? "—"}</span></div>
            <div className="text-sm">Status: <Badge className="ml-1 capitalize">{m.status ?? "—"}</Badge></div>
          </div>

          <div className="space-y-1">
            <div className="text-sm">Plan: <span className="text-muted-foreground">{m.planName ?? "—"}</span></div>
            <div className="text-sm">Start: <span className="text-muted-foreground">{m.startDate ? new Date(m.startDate).toLocaleDateString() : "—"}</span></div>
            <div className="text-sm">End: <span className="text-muted-foreground">{m.endDate ? new Date(m.endDate).toLocaleDateString() : "—"}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}