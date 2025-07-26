
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router =  Router()

router.post("/", authMiddleware , async (req,res) => {
  //@ts-ignore
  const id=req.id
  const body = req.body
  const parsedData = ZapCreateSchema.safeParse(body)

  if (!parsedData.success){
    res.status(411).json({
      message : "Incorrect Inputs"
    })
    return
  }

 const zapId = await prismaClient.$transaction(async tx => {
  //create zap with random triggerId
  const zap = await prismaClient.zap.create({
    data: {
      // userId: id,
      triggerId: "",
      action: {
        create: parsedData.data.actions.map((x,index)=> ({
          actionId : x.availableActionId,
          sortingOrder: index,
          metadata: x.actionMetadata
        }))
      }
    }
  })

  //create trigger
  const trigger = await tx.trigger.create({
    data: {
      triggerId: parsedData.data.availableTriggerId,
      zapId: zap.id,
    }
  })

  //update zap with new triggerId created 
  await tx.zap.update({
    where: {
      id: zap.id
    },
    data: {
      triggerId: trigger.id
    }
  })
  return zap.id
 })
 res.json({
    zapId
  })
 return
})

router.get("/", authMiddleware , async (req,res) => {
  //@ts-ignore
  const id = req.id
  const zaps = await prismaClient.zap.findMany({
    where : {
      // userId : id
    },
    include: {
      action: {
        include: {
          type : true
        }
      },
      trigger: {
        include: {
          type: true
        }
      }
    }
  })
  console.log("zaps handler");
  res.json({zaps})
  return
})

router.get("/:zapId", authMiddleware , async (req,res) => {
    //@ts-ignore
  const id = req.id
  const zapId=req.params.zapId

  const zap = await prismaClient.zap.findFirst({
    where : {
      id: zapId,
      // userId : id
    },
    include: {
      action: {
        include: {
          type : true
        }
      },
      trigger: {
        include: {
          type: true
        }
      }
    }
  })
  console.log("signin handler");
  res.json({zap})
  return
})



export const zapRouter = router 