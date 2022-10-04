const { scopes } = require("../config");
const { spotifyApi } = require("../services/spotify.services");

async function redirectToAuth(req, res) {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
}

async function spotifyAuth(req, res) {
  const { error, code, state } = req.query;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const { access_token, refresh_token, expires_in } = data.body;

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.render("index", {
        message: "Login successful, proceed to home page",
      });

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body.access_token;

        console.log("The access token has been refreshed!");
        console.log("access_token:", access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send(`Error getting Tokens: ${error}`);
    })
    .then(() => {
      spotifyApi.getMe().then(
        (data) => {
          req.session.user = data.body;
          req.session.save((err) => {
            if (err)
              console.log("error saving session after getting user account");
          });
          console.log(
            "Some information about the authenticated user",
            data.body
          );
        },
        (err) => {
          console.log("Something went wrong!", err);
        }
      );
    });
}

async function home(req, res) {
  res.render("home", {
    user: req.session.user,
  });
}

async function getArtistsTopTracks(req, res) {
  spotifyApi
    .clientCredentialsGrant()
    .then(function (data) {
      spotifyApi.setAccessToken(data.body.access_token);

      // Get the most popular tracks by David Bowie in Great Britain
      return spotifyApi.getArtistTopTracks("0oSGxfWSnnOXhD2fKuz2Gy", "GB");
    })
    .then((data) => {
      console.log(data.body.tracks);

      res.render("playlist", {
        tracks: data.body.tracks,
      });
    });
}

async function getMyPlaylist(req, res) {
  spotifyApi
    .clientCredentialsGrant()
    .then(function (data) {
      spotifyApi.setAccessToken(data.body.access_token);

      // Get my playlists
      return spotifyApi.getUserPlaylists("p3p64xouwnofvf9f39ewv7i7d");
    })
    .then(
      (data) => {
        console.log("Retrieved playlists", data.body.items);

        res.render("artistsTopTracks", {
          playlists: data.body.items,
        });
      },
      (error) => {
        console.log("Something went really wrong", error);
      }
    );
}

async function getArtistsTopTracksApiExample(req, res) {
  spotifyApi
    .clientCredentialsGrant()
    .then(function (data) {
      spotifyApi.setAccessToken(data.body.access_token);

      // Get the most popular tracks by David Bowie in Great Britain
      return spotifyApi.getArtistTopTracks("0oSGxfWSnnOXhD2fKuz2Gy", "GB");
    })
    .then((data) => {
      res.status(200).json(data.body.tracks);
    });
}

module.exports = {
  redirectToAuth,
  spotifyAuth,
  home,
  getArtistsTopTracks,
  getMyPlaylist,
  getArtistsTopTracksApiExample
};
