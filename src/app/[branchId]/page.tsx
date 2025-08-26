"use client";

// import { useBranches } from "@/hooks/branch/useBranches";
import React from "react";

export default function Page(props: { params: { branchId: string } }) {
  
    // const { data: user, isLoading, isError, error, status  } = useMeQuery();
//   console.log("user", user, isLoading, isError, error, status);


  // const { data, isLoading, isError, error } = useBranches();
  //     console.log(data, isError, isLoading, error);
  return (
   <div className="p-4">
   <div>Branch ID:</div>
   <div>Welcome to the Gym-Fussion AI Dashboard!</div>
   </div>
    
  );
}
