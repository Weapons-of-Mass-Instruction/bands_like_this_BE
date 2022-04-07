'use strict';

// bring in mongoose
const mongoose = require('mongoose');

// extract schema property from the mongoose object
const { Schema } = mongoose;

// create a Artists schema, define how our object will be structured
// possible updated schema
// 1. searchQuery = string of user
// 2. likeBands x6
// 3 album art-lastfm url image for each like band
// userid or email - auth0

const artistsSchema = new Schema({
  search: { type: String, require: true },
  name: { type: String, require: true },
  genre: { type: String, require: true },
  img: { type: String },
  favorite: { type: Boolean, require: true }
});


const ArtistModel = mongoose.model('Artists', artistsSchema);

module.exports = ArtistModel;

/*
[
{
  search: "The Smiths",
  name: "The Clash",
  genre: "punk",
  img: "OH LOOK A URL",
  favorite: false
}
{
  search: "The Smiths",
  name: "another Band",
  genre: "po punk",
  img: "OH LOOK A URL",
  favorite: false
}





]



*/