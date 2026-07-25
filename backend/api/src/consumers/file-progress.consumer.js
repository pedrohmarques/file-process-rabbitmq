const rabbit = require('../services/rabbitMQ.service');
const { getIO } = require('../services/socketIO');

async function start() {

    await rabbit.assertQueue('file-progress');

    rabbit.consume('file-progress', async (data) => {
        console.log(data);
        getIO()
            .to(data.jobId)
            .emit('file-progress', data);

    });

}

module.exports = {
    start
};