// SHOW IN WICH FOLDER HIDEN VARIABLE ARE & REQUIRE THEM
require('dotenv').config({ path: './config/.env' });

// GET EXPRESS & HBS
const express = require('express');
const hbs = require('hbs');

// REQUIRE API package
const spotifyWebApi = require('spotify-web-api-node')

// EXECUTE EXPRESS
const app = express();

// SET SYNTAX PREFERENCES & ACCESSIBILITY
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// SETTING SPOTIFY API
const spotifyApi = new spotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

// RETRIEVE ACCESS TOKEN
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// ROUTES
const router = require('express').Router()


// RENDER HOMEPAGE
app.get('/', (req, res) => {
    res.render('home')
})


// RENDER ARTIST PAGE AFTER SEARCHING FOR IT
app.get('/artist-search', (req, res) => {


    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            // res.send(data.body);
            res.render('artist-search-results', {
                artistArray: data.body.artists.items
            })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


// RENDER ALBUM AFTER CLICKING ON LINK IN /artist-search
app.get('/albums/:artistId', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // res.send(data);
            res.render('albums', {
                albumsArray: data.body.items
            })
        })
});

app.get('/:albumId/tracks', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.albumId)
        .then(data => {
            // res.send(data)
            res.render('tracks', {
                tracksArray: data.body.items
            })
        })
})




app.listen(process.env.PORT, () => console.log(`Taaaaadddaaaaaaaaaaa you are at ${process.env.PORT}`));
