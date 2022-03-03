import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import api from './routes/api.js';

const filename = fileURLToPath(import.meta.url);

const dirn = path.dirname(filename);
const dirname = path.resolve();
const publicFolder = path.join(dirn, '..', 'public');
const indexHtml = path.join(dirn, '..', 'public', 'index.html');

const buildFolder = path.join(dirname, '/client/build');

const IndexBuildFolder = path.resolve(dirname, 'client', 'build', 'index.html');

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(morgan('combined'));

app.use(express.json());

app.use(express.static(publicFolder));
app.use('/v1', api);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(buildFolder));
  app.get('/*', (req, res) => {
    res.sendFile(IndexBuildFolder);
  });
}
export default app;
