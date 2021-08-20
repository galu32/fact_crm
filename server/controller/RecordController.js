const express = require('express');

const RecordControllerRouter = express.Router();

RecordControllerRouter.post('/save/:recordName', async (req, res) => {
    const RecordClass = require(`../../src/record/${req.params.recordName}.js`);
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const record = RecordClass.fromJson(body);
    try {
        await record.save();
        res.json({ok: true, error: null, record: record.toJson()});
    } catch (error) {
        res.json({ok: false, error: error.message});
    }
});

RecordControllerRouter.get('/bring/:recordName/:internalId', async (req, res) => {
    const RecordClass = require(`../../src/record/${req.params.recordName}.js`);
    const record = await RecordClass.bring(req.params.internalId);
    res.json(record.toJson());
});

RecordControllerRouter.get('/all/:recordName', async (req, res) => {
    const RecordClass = require(`../../src/record/${req.params.recordName}.js`);
    const results = (await RecordClass.findAll()).map(cls => cls.toJson());
    res.json(results);
});

module.exports = RecordControllerRouter;