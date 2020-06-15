import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const astronautSchema = new Schema({
  name: String,
  surname: String,
  nationality: String,
  login: String,
  password: String,
  money: Number,
  rockets: [{ type: Schema.Types.ObjectId, ref: 'Rocket' }],
}, {collection:'Astronaut'});


export const Astronaut = mongoose.model('Astronaut', astronautSchema);