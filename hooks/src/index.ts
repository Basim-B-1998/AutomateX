import { ZapRun, ZapRunOutbox } from './generated/prisma/index.d';
import express from 'express'
import { PrismaClient } from '@prisma/client'; 



const client = new PrismaClient();
const app=express()
app.use(express.json()); 

//https://hooks.zapier.com/hooks/catch/23532506/ub66xda/
//password logic
app.post("/hooks/catch/:userId/:zapId", async (req,res)=>{
  const userId=req.params.userId
  const zapId=req.params.zapId
  const body=req.body

  console.log("reached here");
    console.log("BODY RECEIVED:", body);
  


// store in db a new trigger
await client.$transaction(async tx=>{
   console.log("reached here 2");
  const run = await tx.zapRun.create({
  data: {
    zapId : zapId,
    metadata : body
  }
})
 console.log("reached here 3");
 
  await tx.zapRunOutbox.create({
    data : {
       zapRunId : run.id
    }
  })

})

res.json({
  message : "webhook received"
})
 
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
})
