const ampqlib = require("amqplib");
const { v4: uuid } = require("uuid");

//Conexion que vamos a utilizar 
let amqplibConnection = null;
//crear canal
const getChannel = async () => {
    //comprobamos si no existe si es asi la creamos sino l amandamos, si la llamamos dos veces seguida al metodo ya estara creado con anteriordad, y no creara uno cada vez
    //de momento usamos la de localhost para pruebas
    if (amqplibCOnnection === null) {
        amqplibConnection = await amqplibConnection.connect("amqp://localhost");
    }
    return await amqplibCOnnection.createChannel();
};
//observar las actividades si estamsos mandando algo desde el cliente procesamos operaciones y respondemos de forma adecuada
// cada vez qeu recibamos una llamada rpc lo monitorizara y te dara unos datos

// le pasamos dos parametros la cola de rpc
// el fake response e spara hacer pruebas pero ahi ira la db operation como leer etc o lo que le llegue 
const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
    //aqui asserUque
    const channel = await getChannel();
    // con esto declaramos la cola
    //durable para que no este para siempre una vez enviado desaparecera
    await channel.assertQueue(RPC_QUEUE_NAME, {
        durable: false,
    });
    // esto fija el maximo de envios unaccuracy
    channel.prefetch(1);
    // consume mensajes de esa cola
    channel.consume(
        RPC_QUEUE_NAME,
        async (msg) => {
            // si el mensaje tiene contenido se hace la operacion
            if (msg.content) {
                // db operation
                    const payload = JSON.parse(msg.content.toString());
                    const response = { fakeResponse, payload }; //call fake db operation
                    // a continuacion se devuelve a quien haya hehco la request
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

const requestData = async (RPC_QUEUE_NAME, payload, uuid) => {
    const channel = await getChannel();

    const q = await channel.assertQueue("", { exclusive: true });

    channel.sendToQueue( RPC_QUEUE_NAME, Buffer.from(JSON.stringify(response)), {
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

// este ultimo sirve para mandar request a otros servicios
const RPCRequest = async () => {
    // el uuid es la correlationId dea le otro metodo
    const uuid = uuid();//correlationId
    return requestData(RPC_QUEUE_NAME, payload, uuid)
};
