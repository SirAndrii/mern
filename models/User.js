const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    links: [{ type: Types.ObjectId, ref:''}]
});

module.exports = model('User',schema);
//https://stackoverflow.com/questions/9127174/why-does-mongoose-have-both-schemas-and-models