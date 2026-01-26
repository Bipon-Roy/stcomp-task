import Link from "next/link";

export default function Home() {
   return (
      <div className="m-3">
         <Link href="/dashboard/specialists">Dashboard</Link>
      </div>
   );
}
