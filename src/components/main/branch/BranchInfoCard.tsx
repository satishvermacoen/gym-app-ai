/* ---------------------------------------------
   File: src/components/branch/BranchInfoCard.tsx
--------------------------------------------- */
import React from "react";
import type { BranchInfo } from "@/types/branch";
import { formatAddress, getTodayName, isOpenNow, mapUrlFor } from "./utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BranchHeader, ContactBlock, HoursTable, LocationBlock, TodayBlock,  } from "./molecules";

export type BranchInfoCardProps = {
  data: BranchInfo;
  showMapLink?: boolean;
  showWeeklyHours?: boolean;
  className?: string;
};

export const BranchInfoCard: React.FC<BranchInfoCardProps> = ({
  data,
  showMapLink = true,
  showWeeklyHours = true,
}) => {
  const todayName = getTodayName();
  const today = data.operatingHours?.find((d) => d.day.toLowerCase() === todayName.toLowerCase());
  const status = isOpenNow(today);

  const address = formatAddress(data.location);
  const mapLink = mapUrlFor(data.location);

  return (
    <div className="m-3 p-4">
    <Card className="">
      <CardHeader>
        <BranchHeader name={data.name} status={status} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <LocationBlock address={address} mapLink={mapLink} showMapLink={showMapLink} />
          <ContactBlock contact={data.contact} />
          <TodayBlock todayName={todayName} {...(today ? { today } : {})} />
        </div>
        {showWeeklyHours && (
          <>
            <Separator className="my-6" />
            <HoursTable hours={data.operatingHours} todayName={todayName} />
          </>
        )}
      </CardContent>
    </Card>
    </div>
  );
};