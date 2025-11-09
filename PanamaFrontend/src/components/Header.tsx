import type { JSX } from "react";
import {Banana} from "lucide-react";

export default function Header() : JSX.Element {
   return (
       <header className="border-b-2 border-yellow-500">
           <div className="navbar bg-teal shadow-sm">
               <div className="flex-1">
                   <a className="btn btn-ghost text-3xl text-yellow-500">Panama Pursuit</a>
               </div>
               <div className="flex-none mr-2">
                   <button className="btn !bg-yellow-500">
                       <Banana className="h-6 w-6 text-teal" />
                   </button>
               </div>
           </div>
       </header>
   )
}
