

import { Kafka } from 'kafkajs';

const TOPIC_NAME="zap-events" 


const kafka = new Kafka({
  clientId : 'outbox-processor',
  brokers : ['localhost:9092']
})


async function main(){
  //initialise kafka consumer
  const consumer = kafka.consumer({groupId : 'main-worker'})
  //connects to it
await consumer.connect()
  //subscribe on specfic topic
await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })
  //calls consumer.run every time msg come kog occurs
await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      })
  //stops execution for 1 sec,bcz gor example sending email may take 1 sec
      await new Promise(r => setTimeout(r,5000))

      console.log("processing done");
      
  
  //acknowledges worker had done the job
  await consumer.commitOffsets([{
    topic : TOPIC_NAME,
    partition : partition,
    offset : message.offset + 1
  }])
    },
  })
}


main()