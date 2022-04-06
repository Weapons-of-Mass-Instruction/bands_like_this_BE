'use strict';
const axios = require('axios');
const LASTFM_KEY = process.env.LASTFM_API_KEY;
const MUSICOVERY_API_KEY = process.env.MUSICOVERY_API_KEY;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function searchArtists(searchQuery) { //(req, res, next)
  // let searchQuery = searchQuery;
  // let searchQuery = 'nickleback';
  //id's for bands
  let musicBrainzIDUrl = `https://musicbrainz.org/ws/2/artist/?query=${searchQuery}&fmt=json`;
  //the axios search of our band
  let searchedBandID = await axios.get(musicBrainzIDUrl)
  //the specific results for our first artist searched
  let bandId = searchedBandID.data.artists[0].id;
  let musicoveryRecsUrl = `http://musicovery.com/api/V6/artist.php?fct=getsimilar&id=${bandId}&obscureartists=true&resultsnumber=6&fmt=json${MUSICOVERY_API_KEY}`;

  // async (bandId) =>
  let musicRecs = await axios.get(musicoveryRecsUrl);
  let recsArr = musicRecs.data.artists.artist;
  //going to hold our img url calls
  // let imgArr = [];

  //loop that collects urls for the imgs
  for (let i = 0; i < recsArr.length; i++) {
    // the url that is being queried for the album name
    let albumAndAlbumNameIDUrl = `https://musicbrainz.org/ws/2/release/?query=${recsArr[i].name}&&fmt=json`;
    let albumNameAndIdRes = await axios.get(albumAndAlbumNameIDUrl);
    //grabing the ID and Title for search for the album
    let albumID = albumNameAndIdRes.data.releases[0].id;
    let albumTitle = albumNameAndIdRes.data.releases[0].title;
    // url to search for the img url
    let lastFmUrl = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}&mbid=${albumID}&album=${albumTitle}&format=json`;
    //axios call to get it
    let lastFmResultsObj = await axios.get(lastFmUrl);
    let albumImg = lastFmResultsObj.data.album.image[2]['#text'];
    recsArr[i].img = albumImg
    recsArr[i].searchQuery = searchQuery;
  }
  let results = new Bands(recsArr);
  // console.log(`ResultsFromMaster:`);
  // console.log(results)
  // console.log(`recsArr:`);
  // console.log(recsArr);
  return results;

}

class Bands {
  constructor(recsArr) {
    this.recsParsed = [];
    recsArr.forEach(band => {
      this.recsParsed.push({ 
        search: band.searchQuery,
        name: band.name,
        genre: band.genre,
        img: band.img,
        favorite: false,
       });
    });
  }
}

module.exports = searchArtists;


// class Band {
//   constructor(element) {
//     this.parsedBand = [];
//     element.forEach
//     this.search = element.searchQuery;
//     this.name = element.recsArr.name;
//     this.genre = element.recsArr.genre;
//     this.img = ele2.imgArr;
//     this.favorite = false;
//   }
// }


// 1 . music brainz = search by bandName
// get Music_Brains_ID#

// 2. Music-covery = use Music_Brains_ID#
// get recommended likeBands by bandName, ID
// Take bandID info back to Music Brains

// 3.a music brainz = search by BandID (like original search)
// Get albumID, and albumNameString for like bands

// 3.b last fm = get albumID, albumNameString, APIKEY
// Returns URL image of album art for each of recomended bands



//MASTERAPI save's
// 1. searchQuery = string of user
// 2. likeBands x6
// 3 album art-lastfm url image for each like band
// userid or email - auth0




// let parsedRecs = recsArr.forEach(band => { // where band represents each object in recsArr
//   // iterate through recommended artists to get album name & album ID for each one from MusicBrainz using ID from musicovery
//   let name = band.name;
//   let albumAndAlbumNameIDUrl = `https://musicbrainz.org/ws/2/release/?query=${name}&&fmt=json`
//   let albumNameAndIdRes = await axios.get(albumAndAlbumNameIDUrl);


//   let albumID = albumNameAndIdRes.releases[0].id; // get albumID of first album in results
//   let albumTitle = albumNameAndIdRes.releases[0].title; // get album name of first album in results.


//   let lastFmUrl = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}&mbid=${albumID}&album=${albumTitle}&format=json`; // populate last.FM query url with values of band from forEach loop.
//   // call last.fm for each one using album name and ID and save the returned URL value.
//   let lastFmResultsObj = await axios.get(lastFmUrl);


//   let albumImg = lastFmResultsObj.name[2]['#text'];
//   // call a constructor and parse all this into objects.

// }); // end of foreach




// async function searchArtists(req, res, next) {
//   try {
//     let searchQuery = req.query.searchQuery // users band input from client
//     let musicBrainzIDUrl = `https://musicbrainz.org/ws/2/artist/?query=${searchQuery}&fmt=json`;
//     // getmusicbrainz_ID
//     console.log('searchQuery is', searchQuery);
//     // this next variable will contain the mbID 
//     let searchedBandID = await axios.get(musicBrainzIDUrl); // entire response object
//     let bandId = searchedBandID.artists[0].id;// this is now our MBID
//     console.log('bandId is', bandId);


//     // use MB ID to call musicovery for recommended artists
//     let musicoveryRecsUrl = `http://musicovery.com/api/V6/artist.php?fct=getsimilar&id=${bandId}&obscureartists=true&resultsnumber=6&fmt=json`;
//     let musicRecs = await axios.get(musicoveryRecsUrl); // this is our object of 6 similar bands
//     let recsArr = musicRecs.artists.artist; // this is our array of the 6 recommended bands.
//     console.log('recsArr is', recsArr);

//     // here we have a populated array of 6 recommended bands
//     // TODO: get album artwork for band 1 and attach to band 1 object. Repeat for next 5 bands.
//     getAlbumArtRecs(band); // hand this a single band object. 

//   } catch (error) {
//     console.error(error)
//   }

// }

// /*
// {
//         "mbid": "9a58fda3-f4ed-4080-a3a5-f457aac9fcdd",
//         "name": "Joy Division",
//         "genre": "rock",
//         "country": "UK",
//         "match": "95"
//       },
// */

// async function getAlbumArtRecs(band) {

//   let albumAndAlbumNameIDUrl = `https://musicbrainz.org/ws/2/release/?query=${band.name}&&fmt=json`;
//   let albumNameAndIdRes = await axios.get(albumAndAlbumNameIDUrl);
//   let albumID = albumNameAndIdRes.releases[0].id; // get albumID of first album in results
//   let albumTitle = albumNameAndIdRes.releases[0].title; // get album name of first album in results.
//   let lastFmUrl = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_KEY}&mbid=${albumID}&album=${albumTitle}&format=json`;

//   let lastFmResultsObj = await axios.get(lastFmUrl);
//   let albumImg = lastFmResultsObj.name[2]['#text'];
//   return albumImg;
// };

// console.log(searchArtists('the smiths'));