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
              actionMetadata: {}
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
            availableActionName:""
            }])
        }}><div className="text-2xl">
          +
        </div></PrimaryButton>
      </div>
      </div>
    </div>
    {selectedModalIndex !== null && (
     <Modal index={selectedModalIndex}  open={true}  onOpenChange={(open) => { if (!open) setSelectedModalIndex(null);}} availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions}   onSelect={({ id, name ,image  }) => {
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
                }
              : a
          )
        );
      }
      setSelectedModalIndex(null); // close modal
    }}/>)}
  </div>
}


function Modal({ index,open,onOpenChange,availableItems,onSelect } : {index: number; open: boolean; onOpenChange: (open: boolean) => void; availableItems: {id:string, name:string, image:string}[]; onSelect: (item: { id: string; name: string;image: string }) => void;}){
  
   return  (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>  {index === 1 ? "Select Trigger" : "Select Action"}</DialogTitle>
          <DialogDescription>
              Select a {index === 1 ? "trigger" : "action"} to continue configuring your zap.
          </DialogDescription>
        </DialogHeader>
           <div className="p-4 md:p-5 space-y-4">
          {availableItems.map(({ id, name, image }) => (
            <div key={id} className="flex border p-2 items-center space-x-2 rounded cursor-pointer hover:bg-slate-100"   onClick={() => {
                onSelect({ id, name , image }); //  set selected trigger or action
                onOpenChange(false); // close modal
              }}>
              <img src={image} width={30} height={30} alt={name} className="rounded" />
              <div>{name}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
