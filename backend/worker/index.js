const amqp = require('amqplib');
const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

async function start() {

    const connection = await amqp.connect(url);

    const channel = await connection.createChannel();

    await channel.assertQueue('files');

    console.log('Worker iniciado');

    channel.consume('files', async (msg) => {

        const job = JSON.parse(msg.content.toString());

        console.log('Processando', job.filename);

        channel.ack(msg);

    });

}

start();