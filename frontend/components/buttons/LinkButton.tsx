"use client"
import { ReactNode } from "react"

export const LinkButton = ({children , onClick} : {children: ReactNode , onClick : () => void}) => {
  return <div className="px-4 py-5 cursor-pointer hover:bg-slate-100" onClick={onClick}>
    {children}
  </div>
}