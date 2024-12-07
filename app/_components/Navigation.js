import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function Navigation() {
   const session = await auth();
   console.log(session);


    return(
    <nav className="z-10 text-xl">
        <ul className="flex gap-16">
            <li>
                <Link className="hover:text-accent-400 transition-colors" href="/">Home</Link>
            </li>
            <li>
                <Link href="/cabins">Cabins</Link>
            </li>
            <li>
                <Link href="/about">About</Link>
            </li>

            
            <li>
            {session?.user?.image ? (
                <Link
                  href="/account"
                  className="hover:text-accent-400 transition-colors flex items-center gap-4">
                     <img  
                     className="h-8 rounded-full"
                     src={session.user.image}
                     alt={session.user.name}
                     referrerPolicy="no-referrer"
                     />
                     <span>Guest area</span>
                </Link>

               ): (
                <Link href="/account" 
                   className="hover:text-accent-400 transition-colors">
                    Your Account
                    </Link>
                 )}
            </li>
        </ul>
        </nav>
    )
};
















