export type CurrencyCode = "MYR";

export interface ServiceFormValues {
   title: string;
   description: string;
   estimatedDays: number;
   currency: CurrencyCode;
   price: string;
   additionalOfferings: string[];
   images: Array<File | null>;
}
