export type CurrencyCode = "MYR";

export interface ServiceFormValues {
   title: string;
   description: string;
   status: string;
   estimatedDays: number;
   currency: CurrencyCode;
   price: string;
   additionalOfferings: string[];
   images: Array<File | null>;
}

export interface ServiceFormValues {
   title: string;
   description: string;
   estimatedDays: number;
   currency: CurrencyCode;
   price: string;
   additionalOfferings: string[];
   images: Array<File | null>;
}

export interface UserResponse {
   id: string;
   name: string;
   email: number;
}
export interface ISigninData {
   email: string;
   password: string;
}
