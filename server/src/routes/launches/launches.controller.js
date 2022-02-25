import {
  getAllLaunches,
  addNewLaunch,
  checkIfLaunchExists,
  abortLaunchById,
} from '../../models/launches.models.js';

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}
function httpAddNewLaunches(req, res) {
  const launch = req.body;
  launch.launchDate = new Date(launch.launchDate);

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'You must complete all the required fields',
    });
  }

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  console.log(launchId);
  if (!checkIfLaunchExists(launchId)) {
    return res.status(404).json({
      error: 'Launch not Found',
    });
  }
  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

export { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunch };
