import { ReactNode } from "react";

export const PrimaryButton = ({children,onClick,size="small"} : {children: ReactNode,onClick: () => void, size?: "big" | "small"}) => {
 
  return <div onClick={onClick} className={` bg-amber-600 rounded-2xl text-white ${size === "small" ? "text-sm px-4 py-4 mr-4 mb-2 mt-2" : "text-xl px-8 py-4"}`}>
    {children}
  </div>
}