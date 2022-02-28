import http from 'http';
import mongoose from 'mongoose';
import colors from 'colors';
import app from './app.js';
import { loadPlanetsData } from './models/planets.models.js';

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  'mongodb+srv://nasa-api:Qr6MzgvfcBo8YJQ0@nasacluster.u4hbb.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log(`MongoDB connection ready`.cyan.underline.bold);
});
mongoose.connection.on('error', (err) => {
  console.error(`${err}.`.red.underline.bold);
});
async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
}
startServer();
