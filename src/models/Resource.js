import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  name: String,
  rarity: String,
  price: Number
}, {collection:'Resource'});


export const Resource = mongoose.model('Resource', resourceSchema);