// Centralized API endpoints

export const API_ROUTES = {
  members: {
    list: "/members",
    create: "/members",
    update: (id: string) => `/members/${id}`,
    delete: (id: string) => `/members/${id}`,
  }
} as const;
