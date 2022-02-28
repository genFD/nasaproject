import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

const Planets = mongoose.model('Planet', planetSchema);

export default Planets;
