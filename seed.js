'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const Artists = require('./models/artists');
mongoose.connect(process.env.DB_URL);

async function seed() {
  await Artists.create({
    name: 'Dirty Randy and the Bois',
    genre: 'classic',
    match: 98,
    favorite: true,
    search: 'Nickleback'
  });
  console.log('test one was added');
  mongoose.disconnect();
}

seed();







