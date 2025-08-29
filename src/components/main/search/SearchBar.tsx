// src/components/search/SearchBar.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/search/useSearch";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Search as SearchIcon } from "lucide-react";

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type Props = {
  branchId?: string | null; // optional: lock search within current branch
  placeholder?: string;
};

export default function SearchBar({ branchId = null, placeholder = "Search members, employees, branches…" }: Props) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const debounced = useDebouncedValue(query, 300);
  const [open, setOpen] = React.useState(false);

  const { data, isFetching } = useSearch(debounced, "all", branchId);
  const hasResults =
    !!data &&
    (data.data.members.length > 0 ||
      data.data.employees.length > 0 ||
      data.data.branches.length > 0);

  const buildHref = (item: any, group: "members" | "employees" | "branches") => {
    if (group === "members") return `/app/members/${item._id}`;
    if (group === "employees") return `/app/employees/${item._id}`;
    // For branches, keep same dashboard route pattern you prefer:
    return `/dashboard?branch=${item._id}`;
  };

  const onSelect = (item: any, group: "members" | "employees" | "branches") => {
    setOpen(false);
    setQuery("");
    router.push(buildHref(item, group));
  };

  const Section = ({
    title,
    items,
    group,
    renderLine,
  }: {
    title: string;
    items: any[];
    group: "members" | "employees" | "branches";
    renderLine: (it: any) => React.ReactNode;
  }) =>
    items.length ? (
      <div className="py-1">
        <div className="px-2 text-xs text-muted-foreground uppercase tracking-wide">{title}</div>
        <div className="mt-1">
          {items.map((it) => (
            <button
              key={`${group}-${it._id}`}
              onClick={() => onSelect(it, group)}
              className="w-full text-left px-2 py-2 rounded-md hover:bg-accent focus:bg-accent focus:outline-none"
            >
              {renderLine(it)}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  return (
    <Popover open={open && debounced.trim().length >= 2} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-xl">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="pl-9"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[36rem] p-0" align="start">
        {isFetching && (
          <div className="p-3 text-sm text-muted-foreground">Searching…</div>
        )}
        {!isFetching && !hasResults && debounced.trim().length >= 2 && (
          <div className="p-3 text-sm text-muted-foreground">No results</div>
        )}
        {!isFetching && hasResults && (
          <div className="max-h-96 overflow-auto py-2">
            <Section
              title="Members"
              group="members"
              items={data!.data.members}
              renderLine={(m) => (
                <div className="flex items-center gap-2">
                  <div className="font-medium">
                    {m.fullName?.firstName ?? ""} {m.fullName?.lastName ?? ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {m.memberId ? `• ${m.memberId}` : null} {m.email ? `• ${m.email}` : null}{" "}
                    {m.contact?.mobile ? `• ${m.contact.mobile}` : null}
                  </div>
                </div>
              )}
            />
            <Separator className="my-1" />
            <Section
              title="Employees"
              group="employees"
              items={data!.data.employees}
              renderLine={(e) => (
                <div className="flex items-center gap-2">
                  <div className="font-medium">
                    {e.fullName?.firstName ?? ""} {e.fullName?.lastName ?? ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {e.role ? `• ${e.role}` : null} {e.email ? `• ${e.email}` : null}
                  </div>
                </div>
              )}
            />
            <Separator className="my-1" />
            <Section
              title="Branches"
              group="branches"
              items={data!.data.branches}
              renderLine={(b) => (
                <div className="flex items-center gap-2">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {b.code ? `• ${b.code}` : null} {b.city ? `• ${b.city}` : null}{" "}
                    {b.state ? `• ${b.state}` : null}
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
