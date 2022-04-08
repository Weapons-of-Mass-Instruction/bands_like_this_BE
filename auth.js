'use strict';

// jwt - json web token - also pronounced "jot"
const jwt = require('jsonwebtoken');

// jwks - json web key set - also pronounced "ja-wicks"
const jwksClient = require('jwks-rsa');

// the jwks uri come Auth0 account page -> advanced settings -> Endpoints -> 0auth -> JSON Web Key Set
const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

// from:  https://www.npmjs.com/package/jsonwebtoken - search for "auth0"
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// this is how we do it!
function verifyUser (req, errorFirstOrUserCallbackFunction){
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, {}, errorFirstOrUserCallbackFunction);
  } catch (error){
    errorFirstOrUserCallbackFunction('not authorized');
  }
}

module.exports = verifyUser;
