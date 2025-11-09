import type { JSX } from "react";
import {Bars3Icon} from "@heroicons/react/16/solid";

export default function Header() : JSX.Element {
   return (
       <header className="border-b-2 border-yellow-500">
           <div className="navbar bg-teal shadow-sm">
               <div className="flex-1">
                   <a className="btn btn-ghost text-3xl text-yellow-500">Panama Pursuit</a>
               </div>
               <div className="flex-none">
                   <button className="btn !bg-yellow-500">
                       <Bars3Icon className="h-6 w-6 text-[#4A6B7C]" />
                   </button>
               </div>
           </div>
       </header>
   )
}
