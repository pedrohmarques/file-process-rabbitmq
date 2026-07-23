const express = require('express');
const cors = require('cors');

const rabbit = require('./src/services/rabbitmq.service');
const fileRoutes = require('./src/file-upload/routes/routes');

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

app.use('/files', fileRoutes); // <-- aqui estava faltando

(async () => {
    try {
        await rabbit.connect();

        app.listen(3000, () => {
            console.log('Server Started');
        });

    } catch (error) {
        console.error(error);
    }
})();