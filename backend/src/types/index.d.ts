import { Express } from "express";

interface UserDocument {
    id: string;
    name?: string;
    email?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
            refreshToken: string;
        }
    }
}
export interface ISignInRequest {
    email: string;
    password: string;
}
