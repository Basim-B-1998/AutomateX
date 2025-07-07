"use client";

import { Appbar } from "@/components/Appbar"
import { CheckFeature } from "@/components/CheckFeature"
import { Input } from "@/components/Input"

export default function signup(){
  return <div>
    <Appbar/>
  <div className="px-50 flex">
    <div className="flex-1">
      <div className="flex justify-center">
      <div className="text-3xl font-semibold mt-35 px-7">
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
    <div className="flex-1 mt-50 ml-15 font-medium">
      <Input label={"Work email"} onChange={e => console.log(e.target.value)} type="text" placeholder="" />
      <div className="flex gap-4 mt-4">
      <Input label={"First name"} onChange={e =>  console.log(e.target.value)} type="text" placeholder="" />
      <Input label={"Last name"} onChange={e =>  console.log(e.target.value)} type="password" placeholder="" />
      </div>
    </div>
  </div>
  </div>
}