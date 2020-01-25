const express = require('express');

const server = express();

const cors = require('cors');
const projectRouter = require('./routers/projectRouter.js');
server.use(cors());
server.use(express.json());

server.use('/projects', projectRouter);

server.get('/', (req, res) => {
  res.send('Lets write some sprint code');
});

module.exports = server;
