import { isAxiosError } from "axios";

export interface ApiError<T>{
    statusCode: number;
    error: string;
    message: string;
    data?: T;
    success: boolean;
}

export function getErrorMessage(err: unknown): string {
  // If you use axios:
  
  if (isAxiosError(err)) return err.response?.data?.message ?? err.message;

  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return "Something went wrong";
  }
}