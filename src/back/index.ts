import express from 'express';
import cors from 'cors';

let app = express();
app.use(cors());

import { createServer } from "http";
import path from 'path';

const httpServer = createServer(app);

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../front/index.html'));

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');  
});

app.use(express.static(path.resolve(__dirname + '/../front')));

httpServer.listen(8330);