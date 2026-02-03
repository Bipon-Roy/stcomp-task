"use client";

import Image from "next/image";
import { useGetRequest } from "@/hooks/useGetRequest";

type SpecialistItem = {
   id: string;
   title: string;
   basePrice: string;
   thumbnailUrl: string;
};

function CardSkeleton() {
   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse">
         <div className="aspect-16/10 w-full rounded-xl bg-gray-200 mb-4" />
         <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-full bg-gray-200" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
         </div>
         <div className="h-4 w-full bg-gray-200 rounded mb-1" />
         <div className="h-4 w-5/6 bg-gray-200 rounded mb-3" />
         <div className="h-6 w-24 bg-gray-200 rounded" />
      </div>
   );
}

function SpecialistCardItem({ item }: { item: SpecialistItem }) {
   return (
      <div className="h-full rounded-2xl transition hover:-translate-y-1 hover:shadow-lg">
         {/* Image */}
         <div className="p-3">
            <div className="relative aspect-16/10 overflow-hidden rounded-2xl">
               <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover" />
            </div>
         </div>

         {/* Content */}
         <div className="px-4 pb-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-2 mb-2">
               <div className="relative h-7 w-7 overflow-hidden rounded-full bg-gray-200">
                  <Image src="/serviceAvatar.png" alt={"Avatar"} fill className="object-cover" />
               </div>

               <p className="text-sm text-[#222222]">
                  <span className="font-semibold">Jessica Law</span>
                  <span className="text-gray-500"> - Company Secretary</span>
               </p>
            </div>

            {/* Title */}
            <p className="text-[15px] leading-snug text-[#454545] mb-1">{item.title}</p>

            {/* Price */}
            <p className="text-xl font-semibold text-[#222222]">RM {item.basePrice}</p>
         </div>
      </div>
   );
}

export default function SpecialistCard() {
   const { data, isLoading } = useGetRequest("Published_Specialist", "/specialist/all-published");

   const items: SpecialistItem[] = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

   return (
      <div className="mx-auto mt-6 max-w-430">
         <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
               ? Array.from({ length: 8 }).map((_, idx) => <CardSkeleton key={idx} />)
               : items.map((item) => <SpecialistCardItem key={item.id} item={item} />)}
         </div>

         {!isLoading && items.length === 0 && (
            <div className="py-10 text-center text-gray-500">No specialists found.</div>
         )}
      </div>
   );
}
