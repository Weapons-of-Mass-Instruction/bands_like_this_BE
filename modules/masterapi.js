'use strict';

const axios = require('axios');

// 1 . music brainz = search by bandName  
// get Music_Brains_ID#

// 2. Music-covery = use Music_Brains_ID#
// get recommended likeBands by bandName, ID
// Take bandID info back to Music Brains

// 3.a music brainz = search by BandID (like original search)
// Get albumID, and albumNameString for like bands

// 3.b last fm = get albumID, albumNameString, APIKEY
// Returns URL image of album art for each of recomended bands

async function searchArtists(req, res, next) {
  try {
    let searchQuery = req.query.searchQuery
    let url = `https://musicbrainz.org/ws/2/artist/?query=${searchQuery}&fmt=json`
    //getmusicbrainz_ID
    await 

} catch (error) {
    next(error)
  }

}

//MASTERAPI save's
// 1. searchQuery = string of user
// 2. likeBands x6
// 3 album art-lastfm url image for each like band
// userid or email - auth0