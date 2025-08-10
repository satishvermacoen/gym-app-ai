import React, { createContext } from "react";

type UserContextType = {
      user: any;
      setUser: React.Dispatch<React.SetStateAction<any>>;
};
    
const UserContext = React.createContext<UserContextType>({
      user: null,
      setUser: () => {},
});
    
export default UserContext;