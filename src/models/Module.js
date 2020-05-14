
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
    name: String,
    multiplicator: Number,
}, {collection:'Module'});


export const Module = mongoose.model('Module', moduleSchema);