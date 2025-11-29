import type { UserType } from "@/modules/auth/userTypes";

declare global {
  namespace Express {
    interface UserPayload {
      userId: number;
      type: UserType;
      typeId: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

