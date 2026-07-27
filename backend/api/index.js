require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http')

const rabbit = require('./src/services/rabbitMQ.service');
const { initSocket } = require('./src/services/socketIO')
const fileRoutes = require('./src/file-upload/routes/routes');
const progressConsumer = require('./src/consumers/file-progress.consumer');

const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

const app = express();
const server = http.createServer(app)

app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
}));

initSocket(server, CORS_ORIGIN)
app.use(express.json());
app.use('/files', fileRoutes);

(async () => {
    try {
        await rabbit.connect(RABBITMQ_URL);
        await progressConsumer.start()

        server.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });

    } catch (error) {
        console.error(error);
    }
})();