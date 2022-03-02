import axios from 'axios';
import Launches from './launches.mongo.js';
import Planets from './planets.mongo.js';

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('downloading launch data');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log('problem downloading launch data');
    throw new Error('launch data download failed');
  }
  const launchDocs = await response.data.docs;

  for (const launchDoc of launchDocs) {
    const { payloads } = launchDoc;
    // console.log(launchDoc['date_local']);
    const customers = payloads.flatMap((payload) => payload.customers);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    // console.table(`${launch.flightNumber} ${launch.mission} ${launch.date}`);

    await saveLaunch(launch);
  }
}
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded');
  } else {
    await populateLaunches();
  }
}
// launches.set(launch.flightNumber, launch);

async function getLatestFlightNumber() {
  const latestLaunch = await Launches.findOne({}).sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  const allLaunches = await Launches.find({}, { _id: 0, __v: 0 })
    .skip(skip)
    .sort({ flightNumber: 1 })
    .limit(limit);
  return allLaunches;
}

async function saveLaunch(launch) {
  await Launches.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}
async function scheduleNewLaunch(launch) {
  const planet = await Planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error(`No matching planets found`);
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
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
async function findLaunch(filter) {
  const matchLaunch = await Launches.findOne(filter);
  return matchLaunch;
}
async function checkIfLaunchExists(launchId) {
  const existingLaunch = await findLaunch({
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
  loadLaunchData,
};
