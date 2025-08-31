"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type MemberRow = {
  _id: string;
  fullName?: { firstName?: string; lastName?: string };
  name?: string;            // backend variant
  email?: string;
  phone?: string;
  status?: "active" | "trial" | "frozen" | "expired" | string;
  planName?: string;
  endDate?: string;
  avatarUrl?: string;
};

type Props = {
  rows: MemberRow[];
  baseHref?: string; // default /app/members
};

function initials(name?: string) {
  if (!name) return "M";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatName(row: MemberRow) {
  if (row.name) return row.name;
  const f = row.fullName?.firstName ?? "";
  const l = row.fullName?.lastName ?? "";
  return `${f} ${l}`.trim() || "—";
}

export function MembersTable({ rows, baseHref = "/app/members" }: Props) {
  return (
    <div className="rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden md:table-cell">Plan</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                No members found.
              </TableCell>
            </TableRow>
          )}
          {rows.map((m) => {
            const name = formatName(m);
            return (
              <TableRow key={m._id} className="hover:bg-muted/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={m.avatarUrl} alt={name} />
                      <AvatarFallback>{initials(name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{name}</span>
                      <span className="text-xs text-muted-foreground">ID: {m._id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm">{m.email ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{m.phone ?? "—"}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm">{m.planName ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">
                    {m.endDate ? `Ends ${new Date(m.endDate).toLocaleDateString()}` : "—"}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={m.status === "active" ? "default" : "secondary"} className="capitalize">
                    {m.status ?? "—"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`${baseHref}/${m._id}`} className="text-primary hover:underline">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
