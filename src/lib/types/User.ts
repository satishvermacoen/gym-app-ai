export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: {
        firstName: string;
        lastName: string;
    };
    role: "OWNER" | "ADMIN" | "MANAGER" | "STAFF";
    avatar: {
        public_id: string;
        url: string;
    }
    ownedBranches: string[];

   accessToken: string;
   refreshToken: string;
}

