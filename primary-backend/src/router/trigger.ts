import { AvaiableTrigger } from './../../node_modules/.prisma/client/index.d';

import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router =  Router()

router.get("/available" ,async (req,res) => {
  const availableTriggers =await prismaClient.avaiableTrigger.findMany({})
  res.json({
    availableTriggers
  })
})

export const triggerRouter = router