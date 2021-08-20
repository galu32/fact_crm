const express = require('express');
const next = require('next');

const RecordControllerRouter = require('./server/controller/RecordController');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const server = express();
server.use(express.json());
server.use('/api/record', RecordControllerRouter);

const classmanager = require('./server/classmanager');

app.prepare().then(async () => {

    await classmanager.syncAll();

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});