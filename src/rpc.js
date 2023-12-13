const ampqlib = require("amqplib");
const { v4: uuid4 } = require("uuid");


let amqplibConnection = null;

const getChannel = async () => {
    if (amqplibCOnnection === null) {
        amqplibConnection = await amqplibConnection.connect("amqp://localhost");
    }
    return await amqplibCOnnection.createChannel();
};


const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
    const channel = await getChannel();

    await channel.assertQueue(RPC_QUEUE_NAME, {
        durable: false,
    });
    
    channel.prefetch(1);
    
    channel.consume(
        RPC_QUEUE_NAME,
        async (msg) => {
            
            if (msg.content) {
                
                    const payload = JSON.parse(msg.content.toString());
                    const response = { fakeResponse, payload }; 
                    
                channel.sendToQueue(
                    msg.properties.replayTo,
                    Buffer.from(JSON.stringify(response)),
                    {
                        correlationId: msg.properties.correlationId,
                    }
                );
            }
        }, {
            noAck: false,
        }
    )

};

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
    const channel = await getChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue( RPC_QUEUE_NAME, Buffer.from(JSON.stringify(requestPayload)), {
            replayTo: q.queue,
            correlationId: uuid,
    });

    return new Promise((resolve,reject) => {
        channel.consume(q.queue, (msg) => {
            if (msg.properties.correlationId == uuid) {
                resolve(JSON.parse(msg.content.toString()));
            } else {
                reject("Data not found");
            }
        }, {
            noAck: false,
        });
    });
};


const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
    
    const uuid = uuid4();
    return requestData(RPC_QUEUE_NAME, requestPayload, uuid)
};

module.exports = {
    getChannel,
    RPCObserver,
    RPCRequest
}