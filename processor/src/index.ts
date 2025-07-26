import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = 'zap-events'
const client = new PrismaClient()

const kafka = new Kafka({
  clientId: 'outbox-processor',
  brokers: ['localhost:9092']
})

async function main(){
  const producer = kafka.producer()
  await producer.connect()

  while(1){
    //getting entries from database
     const pendingRows = await client.zapRunOutbox.findMany({
      where:{},
      take : 10
     })
     console.log(pendingRows);

     //send the entries to kafka
        producer.send({
            topic: TOPIC_NAME,
            messages: 
               pendingRows.map(r => {
                return{
                 value: JSON.stringify({ zapRunId : r.zapRunId , stage: 0})
                }
             }
          )
      })
      
      //deletes values that had send
      await client.zapRunOutbox.deleteMany({
        where : {
          id : {
            in: pendingRows.map(x => x.id)
          }
        }
      })
      await new Promise(r => setTimeout(r, 3000));
  }
}

main()

