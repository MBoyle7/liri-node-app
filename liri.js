require("dotenv").config();
var keys = require("./keys.js");
var spotify = (keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs= require("fs");
var omdb = (keys.omdb);
var bandsintown = (keys.omdb);

var userCommand = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");
var fileName = "log.txt";
var time = "Logged: " + moment().format("dddd, MM/DD/YYYY, HH:mm A") + "\n";
var cmdLine = "Command: node " + userCommand + " / " + userSearch + "\n";

function initialUserInput(userCommand, userSearch) {
    switch (userCommand) {
        case "concert-this":
            fetchConcerts(userSearch);
            break;
        case "spotify-this":
            fetchSong(userSearch);
            break;
        case "movie-this":
            fetchMovie(userSearch);
            break;
        case "do-what-it-says":
            doIt();
            break;
        default:
            console.log("I need a command.");
    }
}
initialUserInput(userCommand, userSearch);

function fetchConcerts() {
    axios
        .get("https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp")
        .then(function(response) {
            fs.appendFile(fileName, "Concert Log" + "\n", "utf-8", function(err) {
                if(err) throw err;
            });
            for(var i = 0; i < 5; i++) {

                var concertData = 
                    "Lineup: " + response.data[0].lineup + "\n" +
                    "Venue " + response.data[0].venue.name + "\n" +
                    "City" + response.data[0].venue.city + "\n" +
                    "Date: " + moment(response.data[0].date).format("MM-DD-YYYY")
                    
                    console.log(concertData);
            }
        })
}

function fetchSong(songName) {
    if (!songName || songName === undefined) {
        songName = "the sign ace of base";
    };
    spotify.search({type: "track", query: songName, limit: 5}, function(err, data) {
        fs.appendFile(fileName, "Spotify Log" + "\n", "utf-8", function(err) {
            if(err) throw err;
        });
        for(var i = 0; i < 5; i++) {
            var songData =
                "Title: " + data.tracks.items[i].name + "\n" +
                "Artist: " + data.tracks.items[i].album.artists[0].name + "\n" +
                "Link: " + data.tracks.items[i].href + "\n" +
                "Album: " + data.tracks.items[i].album.name

                console.log(songData);
        }
    })
}

function fetchMovie() {
    if (!userSearch) {
        userSearch = "mr. nobody";
    };

    axios   
        .get("http://www.omdbapi.com/?t=" + userSearch + "&apikey=c28b97d4")
        .then(function(response) {
            fs.appendFile(fileName, "Movie Log" + "\n", "utf-8", function(err) {
                if(err) throw err;
            });

            var movieData =
                "Title: " + response.data.Title + "\n" +
                "Year: " + response.data.Year + "\n" +
                "IMDB Rating: " + response.data.Rating + "\n" +
                "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\n" +
                "Country: " + response.data.Country + "\n" +
                "Language: " + response.data.Language + "\n" +
                "Plot Summary: " + response.data.Plot + "\n" +
                "Actors/Actresses: " + response.data.Actors

                console.log(movieData);
        })
}

function doIt() {
    if(userCommand === "do-what-it-says") {
        fs.readFile("random.txt", "utf-8", function(err, data) {
            if(err) throw err;
        });
    }
}