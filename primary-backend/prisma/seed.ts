import { AvaiableAction } from './../../hooks/src/generated/prisma/index.d';

import { PrismaClient } from "@prisma/client";
const prismaClient = new PrismaClient()

async function main(){
    await prismaClient.avaiableTrigger.create({
      data: {
        id: "webhook",
        name: "Webhook",
        image: "https://flespi.com/storage/news/643e695e865f7/643e7305a97f0.png"
      }
    })

   await prismaClient.avaiableAction.create({
      data: {
        id: "send_sol",
        name: "send Solana",
        image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
      }
    })

       await prismaClient.avaiableAction.create({
      data: {
        id: "email",
        name: "send Email",
        image: "https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png"
      }
    })
}

main()