import React from "react";
import { CardTitle } from "@/components/ui/card";
import { OpenStatusBadge, SectionTitle, LinkA } from "@/components/main/branch/atoms";
import { Contact as BranchContact } from "@/types/branch";
import type { OperatingHour } from "@/types/branch";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

/* ---------------------------------------------
   File: src/components/branch/molecules/BranchHeader.tsx
--------------------------------------------- */
export const BranchHeader: React.FC<{ name: string; status: { open: boolean; closesAt?: string; opensAt?: string } }> = ({ name, status }) => (
<div className="flex flex-wrap items-center justify-between gap-3">
<CardTitle className="text-2xl">{name}</CardTitle>
<OpenStatusBadge
  open={status.open}
  {...(status.closesAt !== undefined ? { closesAt: status.closesAt } : {})}
  {...(status.opensAt !== undefined ? { opensAt: status.opensAt } : {})}
/>
</div>
);

/* ---------------------------------------------
   File: src/components/branch/molecules/LocationBlock.tsx
--------------------------------------------- */
export const LocationBlock: React.FC<{ address: string; mapLink: string; showMapLink?: boolean }> = ({ address, mapLink, showMapLink = true }) => (
  <div>
    <SectionTitle>Location</SectionTitle>
    <div className="mt-2 text-foreground/90">{address}</div>
    {showMapLink && (
      <div className="mt-2">
        <LinkA href={mapLink} target="_blank" rel="noreferrer">View on Maps</LinkA>
      </div>
    )}
  </div>
);


/* ---------------------------------------------
   File: src/components/branch/molecules/ContactBlock.tsx
--------------------------------------------- */
export const ContactBlock: React.FC<{ contact: BranchContact }> = ({ contact }) => {
  const phone = contact.phone || contact.mobile;
  return (
    <div>
      <SectionTitle>Contact</SectionTitle>
      <div className="mt-2 space-y-1 text-foreground/90">
        {contact.mobile && (
          <div>
            <span className="text-muted-foreground mr-2">Mobile:</span>
            <LinkA href={`tel:${contact.mobile}`}>{contact.mobile}</LinkA>
          </div>
        )}
        {contact.phone && (
          <div>
            <span className="text-muted-foreground mr-2">Phone:</span>
            <LinkA href={`tel:${contact.phone}`}>{contact.phone}</LinkA>
          </div>
        )}
        {contact.email && (
          <div>
            <span className="text-muted-foreground mr-2">Email:</span>
            <LinkA href={`mailto:${contact.email}`}>{contact.email}</LinkA>
          </div>
        )}
        {!phone && !contact.email && (
          <div className="text-muted-foreground">Not provided</div>
        )}
      </div>
    </div>
  );
};

/* ---------------------------------------------
   File: src/components/branch/molecules/TodayBlock.tsx
--------------------------------------------- */
export const TodayBlock: React.FC<{ todayName: string; today?: OperatingHour }> = ({ todayName, today }) => (
  <div>
    <SectionTitle>Today ({todayName})</SectionTitle>
    <div className="mt-2 text-foreground/90">
      {today?.isOpen ? (
        <span>
          {today.open} – {today.close}
        </span>
      ) : (
        <span className="text-muted-foreground">Closed</span>
      )}
    </div>
  </div>
);

/* ---------------------------------------------
   File: src/components/branch/molecules/HoursTable.tsx
--------------------------------------------- */
export const HoursTable: React.FC<{ hours: OperatingHour[]; todayName: string }> = ({ hours, todayName }) => (
  <div>
    <SectionTitle>Operating Hours</SectionTitle>
    <div className="mt-2 overflow-hidden rounded-xl border">
      <Table>
        <TableBody>
          {hours.map((d) => {
            const isToday = d.day.toLowerCase() === todayName.toLowerCase();
            return (
              <TableRow key={d._id ?? d.day} className={cn(isToday && "bg-muted/50")}>
                <TableCell className="w-40 text-sm text-muted-foreground">{d.day}</TableCell>
                <TableCell className="text-sm">
                  {d.isOpen ? (
                    <span>
                      {d.open} – {d.close}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Closed</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </div>
);