"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { X, Loader2, Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  isSearching?: boolean;
  placeholder?: string;
};

export function SearchInput({ value, onChange, isSearching, placeholder }: Props) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search members by name, phone, email..."}
        className="pl-9 pr-10"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin opacity-70" />
        ) : value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded hover:bg-muted"
            aria-label="Clear"
            title="Clear"
          >
            <X className="h-4 w-4 opacity-70" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
