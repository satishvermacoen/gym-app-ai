import React from "react";

export default async function Page(props: { params: { branchId: string } }) {
  
    // const { data: user, isLoading, isError, error, status  } = useMeQuery();
//   console.log("user", user, isLoading, isError, error, status);

  return (
   <div className="p-4">
   <div>Branch ID: {props.params.branchId}</div>
   <div>Welcome to the Gym-Fussion AI Dashboard!</div>
   </div>
    
  );
}
