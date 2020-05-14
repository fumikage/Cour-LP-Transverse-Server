import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const rocketSchema = new Schema({
  name: String,
  destinations: { type: Schema.Types.ObjectId, ref: 'Planet'},
  modules: { type: Schema.Types.ObjectId, ref: 'Module' },
  resources: { type: Schema.Types.ObjectId, ref: 'Resource' },
  fuel: Number,
  location: Number
}, {collection:'Rocket'});


export const Rocket = mongoose.model('Rocket', rocketSchema);

/*
mutation CreateRocket{
  	createRocket(name: "Faucon millenium", fuel: 5 )
}

 mutation CreateRocketWithInput{
  	createRocketWithInput(input: {name: "Appollo", fuel: 2}){name fuel}
}

 mutation DeleteRocket{
  deleteRocket(_id: "5ebcf55f2783c55a7498b555" )
}


mutation UpdateRocket{
  	updateRocket(_id: "5ebcf5602783c55a7498b556", input: {name: "insainity", fuel: 123}){name fuel}
}
*/
