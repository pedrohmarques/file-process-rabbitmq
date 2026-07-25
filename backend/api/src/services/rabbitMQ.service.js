const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async connect(url) {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
    }

    async assertQueue(queue, options = { durable: true }) {
        await this.channel.assertQueue(queue, options);
    }

    publish(queue, message, options = { persistent: true }) {
        this.channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(message)),
            options
        );
    }

    consume(queue, callback, options = {}) {
        this.channel.consume(queue, async (msg) => {
            if (!msg) return;

            try {
                const data = JSON.parse(msg.content.toString());

                await callback(data);

                this.channel.ack(msg);
            } catch (err) {
                console.error(err);

                this.channel.nack(msg, false, false);
            }
        }, options);
    }

    getChannel() {
        return this.channel;
    }

    async close() {
        await this.channel?.close();
        await this.connection?.close();
    }
}

module.exports = new RabbitMQService();