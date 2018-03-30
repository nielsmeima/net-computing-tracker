var amqp  = require('amqplib/callback_api');


var exchangeChannel

const createConnection = () => {
  return new Promise((resolve, reject) => {

    amqp.connect('amqp://localhost', (err, connection) => {
      if (err)
        return reject(err)
      
      resolve(connection);
    })

  })
}

const createChannel = () => {
  return new Promise(async (resolve, reject) => {
    try
    {
      let connection = await createConnection();
      connection.createChannel((err, channel) => {
        if (err)
          return reject(err)

        resolve(channel);
      })
    }
    catch (err)
    {
      reject(err);
    }
  })
}

/**
 * Listen to correct exchange
 */
const consumePOINotification = async (broadcastGroup) => {
  try 
  {
    let channel = await createChannel();

    let exchange = 'poi-notification';

    channel.assertExchange(exchange, 'direct', { durable: false });

    channel.assertQueue('', { exclusive: true }, (err, queue) => {
      
      if (err)
        throw err;

      channel.bindQueue(queue.queue, exchange, broadcastGroup);

      channel.consume(queue.queue, (msg) => {
        const buffer = Buffer.from(msg.content);
        const POI = JSON.parse(buffer.toString());

        console.log(`[Sensor Notification] ${POI.description} at LAT ${POI.latitude}, LONG ${POI.longitude}`)
      })

    })

  }
  catch (err)
  {
    console.log('Error consuming POI notification');
    console.log(err)
  }
}

/**
 * Accepts a queue name string and a javascript object as a me
 * @param {string} queue 
 */
const consumeNewBroadcastGroup = async (queue) => {
  try
  {
    let channel = await createChannel();

    
    channel.assertQueue(queue, {durable: false});
    channel.consume(queue, async (msg) => {


      // console.log(" [x] Received %s", msg.content.toString());
      const buffer = Buffer.from(msg.content);
      const newBroadcastGroup = JSON.parse(buffer.toString());

      // Listen to correct exchange
      consumePOINotification(newBroadcastGroup);
      

    }, {noAck: true});


  }
  catch (err)
  {
    let e = new Error(err);
    e.name = 'sendMessage'
    throw e;
  }
}

module.exports = {
  consumeNewBroadcastGroup
}