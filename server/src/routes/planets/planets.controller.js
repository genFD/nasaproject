import { habitablePlanets as planets } from '../../models/planets.models.js';

function getAllPlanets(req, res) {
  return res.status(200).json(planets);
}

export default getAllPlanets;
