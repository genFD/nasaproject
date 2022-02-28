import { getAllPlanets } from '../../models/planets.models.js';

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}

export default httpGetAllPlanets;
