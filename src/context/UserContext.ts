"use client";

import { createContext, useContext, Dispatch, SetStateAction } from "react";
import { User } from "../lib/types/User";

// Defines the shape of the context's value
export interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  logout: () => void;
}

// Creates the context with a default undefined value
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
