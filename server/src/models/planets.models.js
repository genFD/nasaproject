import { parse } from 'csv-parse';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const habitablePlanets = [];

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
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on('error', (err) => {
        console.log(err);
        reject(err);
      })
      .on('end', () => {
        const keplerName = 'kepler_name';
        console.table(habitablePlanets.map((planet) => planet[keplerName]));
        console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      });
  });
}
function getAllPlanets() {
  return habitablePlanets;
}
export { getAllPlanets, loadPlanetsData };
