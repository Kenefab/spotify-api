const router = require('express').Router();
const { 
    redirectToAuth, 
    spotifyAuth, 
    home, 
    getArtistsTopTracks 
} = require('../controllers/spotify.controller');
const { authenticate } = require('../middleware/auth.middleware');


router.get('/', redirectToAuth)
router.get('/callback', spotifyAuth)
router.get('/home', authenticate, home)
router.get('/artists-top-tracks', authenticate, getArtistsTopTracks)


module.exports = router