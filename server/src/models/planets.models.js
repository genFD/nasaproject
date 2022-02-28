import { parse } from 'csv-parse';
import colors from 'colors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Planets from './planets.mongo.js';

// const habitablePlanets = [];

function isHabitablePlanet(planet) {
  const koiDisposition = 'koi_disposition';
  const koiInsol = 'koi_insol';
  const koiPrad = 'koi_prad';
  return (
    planet[koiDisposition] === 'CONFIRMED' &&
    planet[koiInsol] > 0.36 &&
    planet[koiInsol] < 1.11 &&
    planet[koiPrad] < 1.6
  );
}

const filename = fileURLToPath(import.meta.url);

const dirn = path.dirname(filename);

const keplerData = path.join(dirn, '..', '..', 'data', 'kepler_data.csv');

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(keplerData))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (planet) => {
        if (isHabitablePlanet(planet)) {
          savePlanets(planet);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const countPlanetsfound = (await getAllPlanets()).length;
        console.log(
          `${countPlanetsfound} habitable planets found!`.yellow.bold
        );
        resolve();
      });
  });
}
async function getAllPlanets() {
  const planets = await Planets.find({});
  return planets;
}

async function savePlanets(planet) {
  try {
    await Planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.error(`could not save a ${error}`);
  }
}
export { getAllPlanets, loadPlanetsData };
