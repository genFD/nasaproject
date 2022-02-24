import http from 'http';
import app from './app.js';
import { loadPlanetsData } from './models/planets.models.js';

const PORT = process.env.PORT || 8000;

async function startServer() {
  await loadPlanetsData();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();
