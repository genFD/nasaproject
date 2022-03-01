import http from 'http';
import colors from 'colors';
import dotenv from 'dotenv';
import app from './app.js';
import { loadPlanetsData } from './models/planets.models.js';
import { loadLaunchData } from './models/launches.models.js';
import { mongoConnect } from './services/mongo.js';

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`.green.underline);
  });
}
startServer();
