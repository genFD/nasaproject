import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import planetsRouter from './routes/planets/planets.router.js';
import launchesRouter from './routes/launches/launches.router.js';

const filename = fileURLToPath(import.meta.url);

const dirn = path.dirname(filename);

const publicFolder = path.join(dirn, '..', 'public');
const indexHtml = path.join(dirn, '..', 'public', 'index.html');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(morgan('combined'));

app.use(express.json());

app.use(express.static(publicFolder));

app.use('/planets', planetsRouter);

app.use('/launches', launchesRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.join(indexHtml));
});

export default app;
