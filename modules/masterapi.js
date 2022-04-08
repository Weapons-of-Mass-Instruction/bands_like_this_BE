'use strict';
const axios = require('axios');
const LASTFM_KEY = process.env.LASTFM_API_KEY;
const MUSICOVERY_API_KEY = process.env.MUSICOVERY_API_KEY;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function searchArtists(searchQuery) {

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
