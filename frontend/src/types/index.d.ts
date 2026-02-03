export interface UserResponse {
   id: string;
   name: string;
   email: number;
}
export interface ISigninData {
   email: string;
   password: string;
}

export type ApprovalStatus = "approved" | "under-review" | "rejected";
export type PublishStatus = "Published" | "Not Published";
export interface SpecialistListItem {
   id: string;
   title: string;
   price: string;
   purchases: number;
   durationDays: number;
   approvalStatus: ApprovalStatus;
   publishStatus: PublishStatus;
}

export interface SpecialistItemResponse {
   items: SpecialistListItem[];
   meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
   };
}

interface SpecialistMedia {
   id: string;
   fileName: string;
   displayOrder: number;
}

export interface SpecialistById {
   id: string;
   title: string;
   description: string;
   price: string;
   durationDays: number;
   approvalStatus: ServiceFormValues["status"];
   additionalOfferings?: string[];
   media?: SpecialistMedia[];
}
