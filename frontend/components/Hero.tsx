"use client"
import { useRouter } from "next/navigation"
import { PrimaryButton } from "./buttons/PrimaryButton"
import { SecondaryButton } from "./buttons/SecondaryButton"

export const Hero = () => {
  const router = useRouter()
  return <div className="flex">
    <div className="flex-1 pl-20">
   <div className="flex justify-center">
   <div className="text-sm font-normal  pt-45 max-w-lg">
    Scale AI agents with Zapier
     </div>
  </div>
  <div className="flex justify-center">
   <div className="text-5xl font-semibold text-center pt-4 max-w-md">
    The most connected AI orchestration platform
  </div>
  </div>
   <div className="flex justify-center">
   <div className="text-xl font-normal text-center pt-8 max-w-lg">
    Build and ship AI workflows in minutes—no IT bottlenecks, no complexity. Just results.
  </div>
  </div>
  <div className="flex justify-center pt-8">
  <div className="flex ">
    <PrimaryButton onClick={()=>{router.push("/signup")}} size="big">Start free with email</PrimaryButton>
    <div className="pl-4">
    <SecondaryButton onClick={()=>{}} size="big"> Start free with Google</SecondaryButton>
    </div>
  </div>
  </div>
  </div>
  <div className="flex-1">
    <img src="https://res.cloudinary.com/zapier-media/image/upload/f_auto/q_auto/v1745602193/Homepage/hero-illo_orange_ilrzpu.png" alt="" className="h-[600px] w-auto object-contain"/>
  </div>
</div>

}