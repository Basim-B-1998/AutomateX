import { prismaClient } from '../db';
import { AvaiableAction } from './../../../hooks/src/generated/prisma/index.d';

import { Router } from "express";


const router =  Router()

router.get("/available" ,async (req,res) => {
  const availableActions =await prismaClient.avaiableAction.findMany({})
  res.json({
    availableActions
  })
})

export const actionRouter = router