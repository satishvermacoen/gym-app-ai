"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface Branch {
  id: string;
  name: string;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: string | null;
  setSelectedBranch: (id: string) => void;
  fetchBranches: () => Promise<void>;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/branches`, {
        withCredentials: true,
      });
      setBranches(res.data?.branches || []);
      if (res.data?.branches?.length > 0) {
        setSelectedBranch(res.data.branches[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedBranch,
        setSelectedBranch,
        fetchBranches,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within BranchProvider");
  }
  return context;
};
