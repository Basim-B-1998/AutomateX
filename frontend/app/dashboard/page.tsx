"use client"

import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";

export default function (){
  return <div>
    <Appbar/>
    <div className="flex justify-center">
      <div className="flex justify-between pt-8 max-w-screen-lg pr-8 w-full">
        <div className="text-2xl font-bold">
          My Zaps
        </div>
        <DarkButton onClick={()=>{}}>Create</DarkButton>
      </div>
      </div>
  </div>
}