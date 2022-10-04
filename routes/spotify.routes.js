const router = require("express").Router();
const {
  redirectToAuth,
  spotifyAuth,
  home,
  getArtistsTopTracks,
  getMyPlaylist,
  top100Nigeria,
  getArtistsTopTracksApiExample
} = require("../controllers/spotify.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.get("/", redirectToAuth);
router.get("/callback", spotifyAuth);
router.get("/home", authenticate, home);
router.get("/artists-top-tracks", authenticate, getMyPlaylist);
router.get("/artists-top-tracks-api-example", authenticate, getArtistsTopTracksApiExample)

module.exports = router;
