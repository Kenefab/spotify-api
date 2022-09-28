//API Module
const APIController = (function () {
  const clientID = "your ID goes here";
  const clientSecret = "your secret goes here";

  //private methods
  const getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientID + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  const playlists = {
    top100: "37i9dQZEVXbLw80jjcctV1",
  };

  const getTop100 = async (token) => {
    const limit = 10;
    const result = await fetch(
      `https://api.spotify.com//v1/playlists/${playlists.top100}/playlists?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.tracks.items;
  };

  return {
    getToken() {
      return getToken();
    },
    getTop100(token) {
      return getTop100(token);
    },
  };
})();

//UI Module
const DOMElements = {
  top100: document.getElementById("top100"),
  playlistImage: document.getElementById("selected-playlist-img"),
  playlistTitle: document.querySelector("playlist-title"),
  playlistDescription: document.querySelector("playlist-description"),
  playlistTotalSongs: document.querySelector("playlist-total-songs"),
};

//public methods
//   return {};

const APPController = (function (UICtrl, APICtrl) {
  //get DOM elements
  const el = DOMElements.top100;

  //playlist-grid event listeners
  el.addEventListener("click", async (e) => {
    e.preventDefault();

    console.log("Yay!");
  });

  return {
    init() {
      console.log("App is starting");
    },
  };
})(APIController);

APPController.init();
