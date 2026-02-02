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

type PublishTab = "all" | "drafts" | "published";

export type GetAllSpecialistsParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    tab?: PublishTab;
    sortBy?: "created_at" | "price" | "duration" | "purchases";
    order?: "ASC" | "DESC";
};

export type SpecialistListItem = {
    id: string;
    title: string;
    price: string;
    purchases: number;
    durationDays: number;
    approvalStatus: VerificationStatus;
    publishStatus: "Published" | "Draft";
    thumbnailUrl: string | null;
    createdAt: Date;
};
