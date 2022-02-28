import Launches from './launches.mongo.js';
import Planets from './planets.mongo.js';

const DEFAULT_FLIGHT_NUMBER = 100;

// const launches = new Map();
// let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'ZTM'],
  upcoming: true,
  success: true,
};
saveLaunch(launch);
// launches.set(launch.flightNumber, launch);

async function getLatestFlightNumber() {
  const latestLaunch = await Launches.findOne({}).sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function getAllLaunches() {
  // return Array.from(launches.values());
  const allLaunches = await Launches.find({}, { _id: 0, __v: 0 });
  return allLaunches;
}

async function saveLaunch(l) {
  const planet = await Planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error(`No matching planets found`);
  }
  await Launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    l,
    {
      upsert: true,
    }
  );
}
async function scheduleNewLaunch(nl) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(nl, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customers: ['Zero to mastery', 'NASA'],
  });

  await saveLaunch(newLaunch);
}
// function addNewLaunch(l) {
//   latestFlightNumber += 1;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(l, {
//       success: true,
//       upcoming: true,
//       customers: ['ZTM', 'NASA'],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }
async function checkIfLaunchExists(launchId) {
  const existingLaunch = await Launches.findOne({
    flightNumber: launchId,
  });
  return existingLaunch;
}
async function abortLaunchById(launchId) {
  const aborted = await Launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted;
  // return aborted.modifiedCount === 1;
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}
export {
  getAllLaunches,
  checkIfLaunchExists,
  abortLaunchById,
  scheduleNewLaunch,
};
