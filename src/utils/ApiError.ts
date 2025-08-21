export interface ApiError<T>{
    statusCode: number;
    error: string;
    message: string;
    data?: T;
    success: boolean;
}