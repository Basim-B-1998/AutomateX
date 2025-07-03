
import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware";
import {  SigninSchema, SignupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";

const router =  Router()

router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  const body = req.body
  const parsedData = SignupSchema.safeParse(body)

  if (!parsedData.success){
    res.status(411).json({ message: "Incorrect inputs" });
    return;
  }

  const userExists = await prismaClient.user.findFirst({
    where: {
      email : parsedData.data?.username
    }
  })

  if (userExists) {
        res.status(403).json({ message: "User already exists" });
    return;
  }

  
  await prismaClient.user.create({
    data: {
      email : parsedData.data.username,
      password : parsedData.data.password,
      name : parsedData.data.name
    }
  })
  //await sendEmail()

   res.json({
    message : "Please verify your account by checking your email"})
    return
})

router.post("/signin", async (req,res) => {

   const body = req.body
  const parsedData = SigninSchema.safeParse(body)

  if (!parsedData.success){
      res.status(411).json({ message: "Incorrect inputs" });
    return;
  }

  const user = await prismaClient.user.findFirst({
    where : {
      email : parsedData.data.username,
      password : parsedData.data.password
    }
  })

  if (!user){
      res.status(411).json({ message: "Sorry invalid credentials" });
    return;
  }

  //signin using jwt
  const token = jwt.sign({
    id : user.id
  }, JWT_PASSWORD)

  res.json({
    token : token
  })

})

router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  //TODO: fix the type
  //@ts-ignore  
  const id = req.id
  const user = await prismaClient.user.findFirst({
    where: {
      id
    },
    select: {
      name : true,
      email: true
    }
  })
 res.json({
      user
  })
  return
})


export const userRouter = router 