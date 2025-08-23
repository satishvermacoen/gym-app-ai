// Centralized API endpoints

export const API_ROUTES = {
  employee: {
    list: "/employee",
    create: "/employee",
    update: (id: string) => `/employee/${id}`,
    delete: (id: string) => `/employee/${id}`,
  }
} as const;
