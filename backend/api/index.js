const express = require('express');
const cors = require('cors');
const http = require('http')

const rabbit = require('./src/services/rabbitMQ.service');
const { initSocket } = require('./src/services/socketIO')
const fileRoutes = require('./src/file-upload/routes/routes');

const app = express();
const server = http.createServer(app)

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
}));

initSocket(server)
app.use(express.json());
app.use('/files', fileRoutes);

(async () => {
    try {
        await rabbit.connect();

        server.listen(3000, () => {
            console.log('Server Started');
        });

    } catch (error) {
        console.error(error);
    }
})();