import React, { ReactNode } from 'react';
import UserContext from './UserContext';

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState(null);
  return(
    <>
      <UserContext.Provider value={{user, setUser}}>
        {children}
      </UserContext.Provider>
    </>   
    
    
  )
}

export default UserContextProvider;