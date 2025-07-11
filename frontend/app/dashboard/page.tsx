"use client"

import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation" 


interface Zap {
  "id":string,
  "triggerId":string,
  "userId":number,
  "actions": {
        "id":string,
        "zapId":string,
        "actionId":string,
        "sortingOrder":number,
        "type": {
           "id":string,
           "name":string
        }
    }[],

    "trigger": {
    "id": string,
    "zapId": string,
    "triggerId": string,
    "type": {
    "id": string,
    "name": string
  }
}
}


function useZaps(){
  const [loading,setLoading] = useState(true)
  const [zaps,setZaps] = useState<Zap[]>([])

  useEffect(()=>{
       axios.get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
       })
            .then( res => {
              setZaps(res.data.zaps)
              setLoading(false)
            })
  },[]);

  return {
    loading , zaps
  }
}

export default function (){
  const {loading, zaps}=useZaps()

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
    {loading ? "Loading..." : <ZapTable zaps={zaps}/>}
  </div>
}


function ZapTable({ zaps }: {zaps: Zap[]}) {
const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Name</TableHead>
          <TableHead>Last Edit</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Go</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zaps.map((z) => (
          <TableRow key={z.id}>
            <TableCell className="font-medium">
              {z.trigger.type.name}{" "}
              {z.actions.map((x) => x.type.name).join(" ")}
            </TableCell>
            <TableCell>{z.id}</TableCell>
            <TableCell>Nov 13, 2023</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                onClick={() => router.push("/zap/" + z.id)}
              >
                Go
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}