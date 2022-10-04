//UI Module
const DOMElements = {
  top100: document.getElementById("top100"),
  playlistImage: document.getElementById("selected-playlist-img"),
  playlistTitle: document.querySelector("playlist-title"),
  playlistDescription: document.querySelector("playlist-description"),
  playlistTotalSongs: document.querySelector("playlist-total-songs"),
};

const { top100 } = DOMElements

top100.addEventListener("click", async () => {
  console.log("clicked top 100 div");
  const result = await fetch("/artists-top-tracks-api-example")
  const data = await result.json()
  console.log(data)

  //from here you can now use the data to populate the UI however you like
})
