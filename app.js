//Include built in path module, express , zippity-do-dah and forecastio

var path = require('path');
var express = require('express');
var zipdb = require('zippity-do-dah');
var ForecastIo = require("forecastio");


//Crearte an express application

var app = express();

//Creates an forecastio object with API key

var weather = new ForecastIo("669a47998e03327d8be71e50d313fd97");

//serve static files out of public

app.use(express.static(path.resolve(__dirname, "public")));

//Uses ejs as the view engine, and serves the views out of a view folder

app.set("views", path.resolve(__dirname,"views"));
app.set("view engine", "ejs");

//Renders the index view if you hit the homepage

app.get("/", function (req, res) {
  res.render("index");
});

app.get(/^\/(\d{5})$/, function (req, res, next) {

  var zipcode = req.params[0]; // capture the specified zipcode and passes it as req.params[0]
  var location = zipdb.zipcode(zipcode); // Grabs location data with the ZIP code

  if (!location.zipcode){
    next();
    return;
  }

  var latitude = location.latitude;
  var longitude = location.longitude;

  weather.forecast(latitude, longitude, function (err, data) {

    if (err){
      next();
      return;
    }
//Sends this JSON object with express json method
    res.json({
      zipcode: zipcode,
      temperature: data.currently.temperature
    });
  });
});

//Show a 404 error if no route match

app.use(function (req, res) {
  res.status(404).render("404");
});


app.listen(3000, function () {
  console.log("Application is started on PORT 3000");
});
