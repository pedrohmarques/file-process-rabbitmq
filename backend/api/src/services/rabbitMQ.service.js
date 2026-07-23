const amqp = require('amqplib');
const url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

class RabbitMQService {
    async connect() {
        this.connection = await amqp.connect(url)
        this.channel = await this.connection.createChannel()
        await this.channel.assertQueue('files', {
            durable: true
        })
    }

    async publish(message) {
        this.channel.sendToQueue('files', Buffer.from(JSON.stringify(message)), {
            persistent: true
        })
    }
}

module.exports = new RabbitMQService()