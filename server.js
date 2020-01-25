const express = require('express');

const server = express();

const cors = require('cors');
const projectRouter = require('./routers/projectRouter.js');
const actionRouter = require('./routers/actionRouter.js');
server.use(cors());
server.use(express.json());

server.use('/projects', projectRouter);
server.use('/actions', actionRouter);

server.get('/', (req, res) => {
  res.send('Lets write some sprint code');
});

module.exports = server;
