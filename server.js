'use strict';

//required for server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const searchArtists = require('./modules/masterapi.js');

// connect mongoose to our MongoDB
mongoose.connect(process.env.DB_URL);

// must bring in a scheme if we want to interact with that model
const Artists = require('./models/artists.js');

//add validation to confirm we are wired up to our mongoose
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongoose is connected');
});

// implement express
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// define PORT validate env is working
const PORT = process.env.PORT || 3002;

// routes
app.get('/', (request, response) => {
  response.status(200).send('Welcome to our website >:)');
})

app.get('/artists', getArtists);
app.post('/artists', postArtists);
app.delete('/artists/:id', deleteArtists);
app.put('/artists/:id', putArtists);

//////////////// app.get('./modules/masterapi.js', searchArtists);

app.get('*', (request, response) => {
  response.status(404).send('These are not the pages you are looking for...');
})

// add/delete/edit methods
async function getArtists(req, res, next) {
  try {
    let queryObject = {};
    if (req.query.search) {
      queryObject.search = req.query.search;
    }
    let results = await Artists.find(queryObject);
    res.status(200).send(results);
    console.log(`Results: ${results}`);
  } catch(error) {
    next(error);
  }
}

async function postArtists(req,res,next) {
  try {
    let createdSearch = await Artists.create(req.body);
    res.status(200).send(createdSearch);
    console.log(`Added: ${createdSearch}`)
  } catch(error) {
    next(error);
  }
}

async function deleteArtists(req,res,next) {
  let id = req.params.id;
  try {
    await Artists.findByIdAndDelete(id);
    res.send('Artists deleted');
    console.log(`${id} Deleted`)
  } catch(error) {
    next(error);
  }
}

async function putArtists(req,res,next) {
  try {
    let id = req.params.id;
    let updatedArtists = await Artists.findByIdAndUpdate(id, req.body, { new: true, overwrite: true});
    res.status(200).send(updatedArtists);
    console.log(`Updated: ${updatedArtists}`)
  } catch(error) {
    next(error);
  }
}

searchArtists();

// error
app.use((error ,req, res, next) => {
  res.status(500).send(error.message);
})

// listener 
app.listen(PORT, () => console.log(`listening on Port ${PORT}`));