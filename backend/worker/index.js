require('dotenv').config();

const amqp = require('amqplib');
const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

async function start() {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue('files');
    await channel.assertQueue('file-progress');

    console.log('Worker iniciado');

    channel.consume('files', async (msg) => {

        const job = JSON.parse(msg.content.toString());
        console.log('Consumindo fila')

        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        channel.sendToQueue('file-progress', 
            Buffer.from(JSON.stringify({
                jobId: job.jobId,
                filename: job.filename,
                path: job.path,
                size: job.size,
                progress: 30,
                status: 'processing'
            }))
        )

        await new Promise(resolve => setTimeout(resolve, 2000));
        channel.sendToQueue('file-progress', 
            Buffer.from(JSON.stringify({
                jobId: job.jobId,
                progress: 70,
                status: 'processing'
            }))
        )

        await new Promise(resolve => setTimeout(resolve, 2000));
        channel.sendToQueue('file-progress', 
            Buffer.from(JSON.stringify({
                jobId: job.jobId,
                progress: 100,
                status: 'success'
            }))
        )

        channel.ack(msg);

    });

}

start();