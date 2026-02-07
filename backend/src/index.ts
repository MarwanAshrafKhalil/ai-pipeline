import express from 'express';
import cors from 'cors';
import { nodesRouter } from './routes/nodes.js';

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'] }));
app.use(express.json());
app.use('/api', nodesRouter);

app.listen(port, () => {
  console.log(`Mock API listening on http://localhost:${port}`);
});
