"use client";

import { Appbar } from "@/components/Appbar"
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { CheckFeature } from "@/components/CheckFeature"
import { Input } from "@/components/Input"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function signin(){
  const router=useRouter()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  return <div>
    <Appbar/>
  <div className="flex justify-center">
  <div className="px-20 flex max-w-7xl">
    <div className="flex-1">
      <div className="flex justify-center">
      <div className="text-3xl font-bold mt-60 mr-22">
        Automate across your teams
      </div>
    </div>
    <div className="flex justify-center">
      <div className="mt-8 max-w-lg px-2 text-sm">
        Zapier Enterprise empowers everyone in your business to securely automate their work in minutes, not months—no coding required.
      </div>
    </div>
    
  </div>
    <div className="flex-1 mt-33 ml-15 font-medium pt-12 pb-12 px-5 border rounded max-w-md ">
      <Input label={"Email"} onChange={e => {setEmail(e.target.value)}} type="text" placeholder="" />
       <div className="mt-4">
      <Input label={"password"} onChange={e => {setPassword(e.target.value)}} type="text" placeholder="" />
       </div>
      <div className="pt-4 w-[410px]">
      <PrimaryButton onClick={ async ()=>{
        const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
          username : email,
          password
        })
        localStorage.setItem("token",res.data.token)
        router.push("/dashboard")
      }} size="big">Continue</PrimaryButton>
      </div>
      <div className="mt-6 ml-12">
        Don't have a Zapier account yet? 
         <a href="/signup" className="text-blue-600 underline hover:text-blue-800 ml-1">
          SignUp
        </a>.
      </div>
    </div>
  </div>
  </div>
  </div>
}