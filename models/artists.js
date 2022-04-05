'use strict';

// bring in mongoose
const mongoose = require('mongoose');

// extract schema property from the mongoose object
const { Schema } = mongoose;

// create a Artists schema, define how our object will be structured

const artistsSchema = new Schema({
  name: {type: String, require: true},
  genre: {type: String, require: true},
  match: {type: Number, require: true},
  favorite: {type: Boolean, require: true},
  search: {type: String, require: true},
  img: {type: String}
});

const ArtistModel = mongoose.model('Artists', artistsSchema);

module.exports = ArtistModel;