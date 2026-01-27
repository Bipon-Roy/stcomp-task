import Navbar from "@/components/navbar/Navbar";
import Link from "next/link";

export default function Home() {
   return (
      <>
         <Navbar />
         <Link href="/dashboard/specialists" className="fon">
            Dashboard
         </Link>
      </>
   );
}
