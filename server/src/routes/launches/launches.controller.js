import {
  getAllLaunches,
  checkIfLaunchExists,
  abortLaunchById,
  scheduleNewLaunch,
} from '../../models/launches.models.js';

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunches(req, res) {
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

  if (Number.isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existingLaunch = await checkIfLaunchExists(launchId);
  if (!existingLaunch) {
    return res.status(404).json({
      error: 'Launch not Found',
    });
  }
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    res.status(400).json({
      error: 'Launch not aborted',
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

export { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunch };
