"use client";

import React from "react";
import Link from "next/link";
import { useBranch } from "@/context/BranchContext";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Home, Users, Briefcase, BarChart, Settings, User } from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Members", icon: Users, href: "/member" },
  { label: "Employees", icon: Briefcase, href: "/employee" },
  { label: "Finances", icon: BarChart, href: "/finance" },
  { label: "Profiles", icon: Settings, href: "/profile" },
];

export default function Sidebar() {
  const { branches, selectedBranch, setSelectedBranch } = useBranch();

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col justify-between">
      {/* Top: Branch Selector + Menu */}
      <div>
        {/* Branch Dropdown */}
        <div className="p-4 border-b">
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

        {/* Menu Items */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom: User Profile */}
      <div className="p-4 border-t flex items-center gap-3">
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">John Doe</p>
          <Link href="/profile" className="text-sm text-gray-500 hover:underline">
            Manage Profile
          </Link>
        </div>
      </div>
    </aside>
  );
}
