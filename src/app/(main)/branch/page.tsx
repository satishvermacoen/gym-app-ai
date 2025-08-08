"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getBranchList } from "@/lib/api/Response-Branch";


// --- TypeScript Interfaces for the Branch Data ---

interface Location {
  adreessline1: string;
  addressline2: string;
  city: string;
  state: string;
  pinCode: number | null;
  country: string;
}

interface Contact {
  mobile: string;
  phone: string;
  email: string;
}

interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
  _id: string;
}

export interface Branch {
  _id: string;
  name: string;
  location: Location;
  contact: Contact;
  operatingHours: OperatingHours[];
  staff: string[];
  owner: string[];
  createdAt: string;
  updatedAt: string;
}

// --- Branch Card Component ---

const BranchCard = ({ branch }: { branch: Branch }) => {
  const fullAddress = `${branch.location.adreessline1}, ${branch.location.city}, ${branch.location.state} - ${branch.location.pinCode}`;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{branch.name}</CardTitle>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Active
          </Badge>
        </div>
        <CardDescription>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <MapPin className="mr-1 h-3 w-3" />
            {branch.location.city}, {branch.location.state}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{branch.contact.mobile}</span>
          </div>
          <p className="text-muted-foreground pt-2">{fullAddress}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/(main)/dashboard?branchId=${branch._id}`}>View Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// --- Skeleton Loader Component ---

const BranchCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);

// --- Main Page Component ---

export default function BranchListPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const response = await getBranchList();
        setBranches(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch branches. Please try again.");
        console.error("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Your Branches</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Branch
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <BranchCardSkeleton key={i} />
          ))}
        </div>
      ) : branches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <BranchCard key={branch._id} branch={branch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Branches Found</h2>
          <p className="text-muted-foreground mt-2">
            Get started by adding your first gym branch.
          </p>
          <Button className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Branch
          </Button>
        </div>
      )}
    </div>
  );
}
