"use client";

import { Appbar } from "@/components/Appbar"
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { CheckFeature } from "@/components/CheckFeature"
import { Input } from "@/components/Input"
import { useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function signup(){
  const router = useRouter()
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  return <div>
    <Appbar/>
  <div className="flex justify-center">
  <div className="px-20 flex max-w-7xl">
    <div className="flex-1">
      <div className="flex justify-center">
      <div className="text-3xl font-semibold mt-35 px-5">
        AI Automation starts and scales with Zapier
      </div>
    </div>
    <div className="flex justify-center">
      <div className="mt-8 max-w-lg px-2">
        Orchestrate AI across your teams, tools, and processes. Turn ideas into automated action today, and power tomorrow’s business growth.
      </div>
    </div>
      <div className="flex justify-center">
        <div className="mt-8 pr-20">
          <div className="pb-4">
          <CheckFeature label={"Integrate 8,000+ apps and 300+ AI tools without code"}/>
          </div>
           <div className="pb-4">
          <CheckFeature label={"Build AI-powered workflows in minutes, not weeks"}/>
          </div>
          <div>
          <CheckFeature label={"14-day trial of all premium features and apps"}/>
          </div>
        </div>
      </div>
  </div>
    <div className="flex-1 mt-33 ml-15 font-medium pt-12 pb-12 px-5 border rounded space-y-4">
        <Input label={"Name"} onChange={e => {setName(e.target.value)}} type="text" placeholder="" />
        <Input label={"Email"} onChange={e =>  {setEmail(e.target.value)}} type="text" placeholder="" />
        <Input label={"Password"} onChange={e =>  {setPassword(e.target.value)}} type="password" placeholder="" />
      <div className="pt-4 w-[410px] ml-10">
      <PrimaryButton onClick={ async ()=>{
          const res = await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
            username: email,
            password,
            name
          })
        console.log(res.data.message); 
        router.push("/login")
      }} size="big">Get started for free</PrimaryButton>
      </div>
    </div>
  </div>
  </div>
  </div>
}