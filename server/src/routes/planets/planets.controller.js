import { getAllPlanets } from '../../models/planets.models.js';

function httpGetAllPlanets(req, res) {
  return res.status(200).json(getAllPlanets());
}

export default httpGetAllPlanets;
