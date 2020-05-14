
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const planetSchema = new Schema({
    name: String,
    costDestination: Number,
    resources: { type: Schema.Types.ObjectId, ref: 'Resource' },
}, {collection:'Planet'});


export const Planet = mongoose.model('Planet', planetSchema);