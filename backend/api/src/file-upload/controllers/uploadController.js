const rabbit = require('../../services/rabbitMQ.service');
const { randomUUID } = require('crypto');

exports.upload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'Nenhum arquivo enviado'
            });
        }
        const jobs = [];

        for (const file of req.files) {

            const job = {
                jobId: randomUUID(),
                filename: file.originalname,
                path: file.path,
                size: file.size,
                createdAt: new Date()
            };

            await rabbit.publish('files', job);

            jobs.push(job);
        }

        return res.status(202).json(jobs);

    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao processar upload'
        });
    }
};