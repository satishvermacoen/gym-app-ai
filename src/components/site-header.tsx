"use client"

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from './ui/button';
import { MagnetIcon, SearchIcon } from 'lucide-react';

export function SiteHeader() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Format the date and time
  const formattedDateTime = currentDateTime.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 hidden h-4 lg:block"
        />
        <form className="w-full max-w-100 flex items-center gap-2">
          <Input placeholder="Search..." />
        </form>
        <Button className='bg-gray-500'>
          <SearchIcon/>
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden text-sm font-medium text-gray-600 dark:text-gray-300 sm:block">
            {formattedDateTime}
          </div>
        </div>
      </div>
    </header>
  )
}
