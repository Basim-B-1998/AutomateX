import { ReactNode } from "react";

export const SecondaryButton = ({children,onClick,size="small"} : {children: ReactNode,onClick: () => void, size?: "big" | "small"}) => {
 
  return <div onClick={onClick} className={` border rounded-sm font-medium  cursor-pointer text-black ${size === "small" ? "text-sm px-4 py-3 mr-4 mb-2 mt-2" : "text-xl px-8 py-2"}border-gray-300 hover:shadow-md`}>
    {children}
  </div>
}