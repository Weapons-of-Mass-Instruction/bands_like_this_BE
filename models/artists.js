'use strict';

// bring in mongoose
const mongoose = require('mongoose');

// extract schema property from the mongoose object
const { Schema } = mongoose;

const artistsSchema = new Schema({
  search: { type: String, require: true },
  name: { type: String, require: true },
  genre: { type: String, require: true },
  img: { type: String },
  favorite: { type: Boolean, require: true }
});


const ArtistModel = mongoose.model('Artists', artistsSchema);

module.exports = ArtistModel;
