"use client"
import { ReactNode } from "react"

export const LinkButton = ({children , onClick} : {children: ReactNode , onClick : () => void}) => {
  return <div className="flex justify-center px-2 py-5 cursor-pointer hover:bg-slate-100 rounded-md text-base font-normal" onClick={onClick}>
    {children}
  </div>
}