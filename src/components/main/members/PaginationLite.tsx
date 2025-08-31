"use client";

import { Button } from "@/components/ui/button";

type Props = {
  page: number;
  limit: number;
  total?: number;
  hasNextPage?: boolean;
  onPageChange: (page: number) => void;
};

export function PaginationLite({ page, limit, total, hasNextPage, onPageChange }: Props) {
  const canPrev = page > 1;
  const canNext = hasNextPage ?? (typeof total === "number" ? page * limit < total : true);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="text-sm text-muted-foreground">
        Page <strong>{page}</strong>
        {typeof total === "number" ? (
          <> • Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          Prev
        </Button>
        <Button size="sm" disabled={!canNext} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
