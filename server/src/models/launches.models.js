const launches = new Map();
let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration',
  rocket: 'Explorer IS1',
  lauchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'ZTM'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}
function checkIfLaunchExists(launchId) {
  return launches.has(launchId);
}
function addNewLaunch(l) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(l, {
      success: true,
      upcoming: true,
      customers: ['ZTM', 'NASA'],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}
export { getAllLaunches, addNewLaunch, checkIfLaunchExists, abortLaunchById };
