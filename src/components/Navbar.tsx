"use client";

import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useBranch } from "@/context/BranchContext";

export default function Navbar() {
  const { branches, selectedBranch, setSelectedBranch } = useBranch();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="w-full h-16 border-b bg-white flex items-center justify-between px-4 shadow-sm">
      {/* Left: Branch Selector */}
      <div className="w-64">
        <Select value={selectedBranch || ""} onValueChange={setSelectedBranch}>
          <SelectTrigger>
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-lg px-4">
        <Input placeholder="Search..." className="w-full" />
      </div>

      {/* Right: Time & Date */}
      <div className="text-right text-sm font-medium text-gray-600">
        <div>{currentTime.toLocaleTimeString()}</div>
        <div>{currentTime.toLocaleDateString()}</div>
      </div>
    </header>
  );
}
