// Centralized API endpoints

export const API_ROUTES = {
  branchesInfo: {
    list: "/branch/get",
    register: "/branch/register",
    update: (id: string) => `/branch/${id}`,
    dashboard: (id: string) => `/branch/${id}/dashboard`,
  },
  
} as const; 
