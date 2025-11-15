import type { UserType } from "@/modules/auth/userTypes";

declare global {
  namespace Express {
    interface UserPayload {
      userId: number;
      type: UserType;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

