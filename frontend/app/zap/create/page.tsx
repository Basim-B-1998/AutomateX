"use client"
import { Appbar } from "@/components/Appbar"
import { LinkButton } from "@/components/buttons/LinkButton"
import { PrimaryButton } from "@/components/buttons/PrimaryButton"
import { ZapCell } from "@/components/ZapCell"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from "axios"
import { BACKEND_URL } from "@/app/config"
import { useRouter } from "next/navigation"
import { Input } from "@/components/Input"


// Hook to load available triggers and actions
function useAvailableActionsAndTriggers(){
  const [ availableActions, setAvailableActions] = useState([])
  const [ availableTriggers, setAvailableTriggers] = useState([])

  useEffect(()=>{
      axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
          .then(x => setAvailableTriggers(x.data.availableTriggers))
      axios.get(`${BACKEND_URL}/api/v1/action/available`)
          .then(x => setAvailableActions(x.data.availableActions))
  },[])

  return {
    availableActions,
    availableTriggers
  }
}

export default function ZapCreatePage(){
 const router = useRouter()
 const {availableActions,availableTriggers} = useAvailableActionsAndTriggers()
 const [selectedTrigger, setSelectedTrigger] = useState<{
  id: string;
  name: string;
  image: string;
  } | null>(null)

 const [selectedActions,setSelectedActions] = useState<{
  index:number;
  availableActionId: string;
  availableActionName: string;
  metadata: any
  }[]>([])
 const [selectedModalIndex,setSelectedModalIndex] = useState<null | number>(null)
 

  return <div>
    <Appbar/>
    <div className="flex justify-end  bg-slate-200">
      <PrimaryButton onClick={ async ()=>{
        if (!selectedTrigger?.id){
          return;
        }
          const response = await axios.post(`${BACKEND_URL}/api/v1/zap` , {
            "availableTriggerId": selectedTrigger.id,
            "triggerMetadata": {},
            "actions": selectedActions.map(a => ({
              availableActionId: a.availableActionId,
              actionMetadata: a.metadata
            }))
          },{
            headers: {
              Authorization : localStorage.getItem("token")
            }
          })
          router.push("/dashboard")

      }}>Publish</PrimaryButton>
    </div>
    <div className="w-full min-h-screen bg-slate-200 flex flex-col pt-45">
        <div className="flex justify-center cursor-pointer">
            <ZapCell onClick={()=>{setSelectedModalIndex(1)}} name={selectedTrigger ? selectedTrigger.name : "Trigger"} index={1} image={selectedTrigger?.image}/>
        </div>
        <div>
            {selectedActions.map((action) =><div key={action.index} className="flex justify-center pt-2 cursor-pointer"> <ZapCell onClick={()=>{setSelectedModalIndex(action.index)}} name = {action.availableActionName ? action.availableActionName : "Action"} index={action.index}/>
            </div>)}
        </div>
      <div className=" flex justify-center">
      <div>
        <PrimaryButton onClick={()=>{
          setSelectedActions(a => [...a, {
            index: a.length+2,
            availableActionId:"",
            availableActionName:"",
            metadata: {}
            }])
        }}><div className="text-2xl">
          +
        </div></PrimaryButton>
      </div>
      </div>
    </div>
    {selectedModalIndex !== null && (
     <Modal index={selectedModalIndex}  open={true}  onOpenChange={(open) => { if (!open) setSelectedModalIndex(null);}} availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions}   onSelect={({ id, name ,image ,metadata }) => {
      if (selectedModalIndex === 1) {
        setSelectedTrigger({ id, name, image }); //  Trigger update
      } else {
        setSelectedActions((actions) =>
          actions.map((a) =>
            a.index === selectedModalIndex
              ? {
                  ...a,
                  availableActionId: id,
                  availableActionName: name,
                  metadata: metadata
                }
              : a
          )
        );
      }
      setSelectedModalIndex(null); // close modal
    }}/>)}
  </div>
}


function Modal({ index,open,onOpenChange,availableItems,onSelect } : {index: number; open: boolean; onOpenChange: (open: boolean) => void; availableItems: {id:string, name:string, image:string}[]; onSelect: (item: { id: string; name: string;image: string;metadata:any }) => void;}){
  const [step,setStep] = useState(0)
  const [selectedAction,setSelectedAction] = useState<{
    id : string;
    name : string;
  }>()
  const isTrigger = index === 1;


   return  (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>  {index === 1 ? "Select Trigger" : "Select Action"}</DialogTitle>
          <DialogDescription>
              Select a {index === 1 ? "trigger" : "action"} to continue configuring your zap.
          </DialogDescription>
        </DialogHeader>
         {/* selectedAction?.id same as id in availableAction */}
        {(step === 1 && selectedAction?.id === "email" &&  <EmailSelector setMetadata={(metadata) => {
          onSelect({
            ...selectedAction,
            metadata
          })
        }}/>)}

        {(step === 1 && selectedAction?.id === "send_sol" &&   <SolanaSelector setMetadata={(metadata) => {
          onSelect({
            ...selectedAction,
            metadata
          })
        }}/>)}

        {step === 0 &&     <div className="p-4 md:p-5 space-y-4">
          {availableItems.map(({ id, name, image }) => (
            <div key={id} className="flex border p-2 items-center space-x-2 rounded cursor-pointer hover:bg-slate-100"   onClick={() => {
                if (isTrigger){
                  onSelect({ id,
                             name ,
                             image,
                            metadata: {} }); //  set selected trigger or action
                   onOpenChange(false); // close modal
                } else {
                  setStep(s => s + 1)
                  setSelectedAction({
                    id,
                     name 
                  })
                }
                
              }}>
              <img src={image} width={30} height={30} alt={name} className="rounded" />
              <div>{name}</div>
            </div>
          ))}
        </div>}

        
      </DialogContent>
    </Dialog>
  )
}


function EmailSelector({setMetadata} : {setMetadata: (params : any)=> void}) {

  const [email,setEmail] = useState("")
  const [body,setBody] = useState("")
 
  return <div className="space-y-2">
     <Input  label={"To"} type={"text"} placeholder="To" onChange={(e) => setEmail(e.target.value)}></Input>
     <Input  label={"Body"} type={"text"} placeholder="Body" onChange={(e) => setBody (e.target.value)}></Input>
      <PrimaryButton onClick={()=>{
        setMetadata({
          email,
          body
        })
    }}>Submit</PrimaryButton>
  </div>
}

function SolanaSelector({setMetadata} : {setMetadata: (params : any)=> void}) {

  const [amount,setAmount] = useState("")
  const [address,setAddress] = useState("")

  return <div className="space-y-2"> 
    <Input  label={"To"} type={"text"} placeholder="To" onChange={(e) => setAddress(e.target.value)}></Input>
    <Input  label={"Amount"} type={"text"} placeholder="To" onChange={(e) => setAmount(e.target.value)}></Input>
    <PrimaryButton onClick={()=>{
        setMetadata({
          amount,
          address
        })
    }}>Submit</PrimaryButton>
    </div>
}