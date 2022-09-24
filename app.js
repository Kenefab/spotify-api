//Imports
const express = require("express");
const path = require("path");
require("dotenv").config();
const spotifyRouter = require("./routes/spotify.routes");
const session = require("express-session");

const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "your secret to be stored in the .env file",
  })
);

//static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//use router
app.use("/", spotifyRouter);

module.exports = app;
