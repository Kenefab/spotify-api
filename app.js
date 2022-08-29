//Imports
const express = require("express");
const app = express();
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();
const axios = require("axios").default;

//static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));

//view engine
app.set("views", "./views");
app.set("view engine", "ejs");

//authorization code
// const authorizationCode =
//   "AQC5gh97pI7uTATwICrrVNHtmNt5Hf0qm4R8z-MBsmhwwx39UPhzVSRNYDy5UzdCgijoadH2p2INooIXSWB8s298cGZSxs1viomu6iIMZP41YZejvMzeNoxse3efao8AzZWrGigkZwXCJAgkGhwOC1fPm_fuo4BM4zj_ro4QEmxh87Zpntqg1i7zW70ijxHZn5TN3UVT4wsIBsNNXIoIVVW-sJZdpoQjJM8QxaQXebMHutpQgHAApVtqRRkAlvJwekE_KxUpHI_URjAXs79xTLFSfzluTUzJvAvUkTPl3RJPEADbDsnz_K-ZbN7kr2nhPkvru2ZqperovutGqq7-Vlyhjiheok2FaYtRuVIypP9Gm5HGlhMrVetR6bnybCklMJohiABLqC1x_0bDot-Zw7vl5BVMSxrXQvLWQac97bdEbu8xoq8RJKkjFu76WgH1Fjp3I5nyL3plpuXCQdQ4mi0YTQ";

//spotify-api scopes, credentials and config
const scopes = [
  "ugc-image-upload",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "streaming",
  "app-remote-control",
  "user-read-email",
  "user-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "playlist-read-private",
  "playlist-modify-private",
  "user-library-modify",
  "user-library-read",
  "user-top-read",
  "user-read-playback-position",
  "user-read-recently-played",
  "user-follow-read",
  "user-follow-modify",
];

const spotifyApi = new SpotifyWebApi({
  clientId: "8008c1ac980e4c9db3e3810b158e4ad7",
  clientSecret: "60894bb751ac4f37b716c2bcb8fc5746",
  redirectUri: "http://localhost:3000/callback",
});

// const accessToken =
//   "BQCUvMwR8syZxW_InLXDhXCnadpndRPnfbImOv4Tw-uHMPFg9rBFW50F8GJ38cAIjQZMUFW6D-cfNJVlxmm0fl-lV_pPCQE5Uf4GQ-gc19mwQSJEDj7N-5ZNaJtEd1XKT_A8z6Qs8BXi5tmKJITdXN9IffBaaRcgnHNo3C0JN-xz5NXjcL_2Illuw-tXpvClGZgM3HYMsuc2-5V2pPx5S7N4tKcIhmx4b_Ld";

//routes
router.get("/", (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
  //   res.redirect(
  //     spotifyApi.createAuthorizeURL([
  //       "ugc-image-upload",
  //       "user-modify-playback-state",
  //       "user-follow-modify",
  //       "user-read-recently-played",
  //       "user-read-playback-position",
  //       "playlist-read-collaborative",
  //       "app-remote-control",
  //       "user-read-playback-state",
  //       "user-read-email",
  //       "streaming",
  //     ])
  //   );
});

//refresh_token: "AQD2p-9VfcNXVf2_YtkUyGUjWmKs-8BJ1wPf-ONcpLC2Nmu0MK-be0igjo3i_URm84a-SXI4SfMtXOcxnd2kdSfdDrPMgAVSGDHFFdw4MntiWd3BNXSDs1MNc8hueXHONvc"

router.get("/callback", (req, res) => {
  //   console.log("reqquery", req.query);
  //   const code = req.query.code;
  //   //   console.log("code", code);
  //   //   res.send(JSON.stringify(req.query));
  //   spotifyApi.authorizationCodeGrant(req.query.code).then((response) => {
  //     res.send(JSON.stringify(response));
  //     spotifyApi.setAccessToken(accessToken);
  //   });
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error("Callback Error:", error);
    res.send(`Callback Error: ${error}`);
    return;
  }
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const access_token = data.body["access_token"];
      const refresh_token = data.body["refresh_token"];
      const expires_in = data.body["expires_in"];

      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      console.log(
        `Sucessfully retreived access token. Expires in ${expires_in} s.`
      );
      res.send("Success! Access and Refresh tokens have been retrieved");

      setInterval(async () => {
        const data = await spotifyApi.refreshAccessToken();
        const access_token = data.body["access_token"];

        console.log("The access token has been refreshed!");
        console.log("access_token:", access_token);
        spotifyApi.setAccessToken(access_token);
      }, (expires_in / 2) * 1000);
    })
    .catch((error) => {
      console.error("Error getting Tokens:", error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

// spotifyApi.setAccessToken(accessToken);
/////////////////////////////////////////////////////////////functions accessing the api
const getMe = () => {
  spotifyApi.getMe().then(
    (data) => {
      console.log("Some information about the authenticated user", data.body);
    },
    (err) => {
      console.log("Something went wrong!", err);
    }
  );
};

getMe();

// const getMyPlaylist = () => {
//   // Get a user's playlists
//   spotifyApi.getUserPlaylists("p3p64xouwnofvf9f39ewv7i7d").then(
//     (data) => {
//       console.log("Retrieved playlists", data.body);
//     },
//     (err) => {
//       console.log("Something went wrong while getting the playlists!", err);
//     }
//   );
// };

// getMyPlaylist();

// const getPlaylist = async () => {
//   const data = await spotifyApi.getUserPlaylists("p3p64xouwnofvf9f39ewv7i7d");

//   for (let i = 0; i < data.body.items.length; i++) {
//     console.log("data", data.body.items[i]);
//   }
// };

// // getPlaylist();

// const getAlbum = () => {
//   spotifyApi
//     .getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE", { limit: 10, offset: 20 })
//     .then(
//       function (data) {
//         console.log("Album information", data.body);
//       },
//       function (err) {
//         console.error(err);
//       }
//     );
// };

// getAlbum();

//use router
app.use("/", router);

//Listening port
const PORT = 3000;
app.listen(PORT, () => {
  console.log("server running on port 3000");
});
