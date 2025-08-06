"use client"
import { ReactNode } from "react";

export const DarkButton = ({children,onClick,size="small"} : {children: ReactNode,onClick: () => void, size?: "big" | "small"}) => {
 
  return <div onClick={onClick} className={`flex flex-col justify-center px-8 py-2 bg-purple-800 hover:bg-purple-900 rounded hover:shadow-md cursor-pointer text-center text-white `}>
    {children}
  </div>
}