// setup empty JS object to act as endpoint for all routes
const projectData = {};

// require Express to run server and routes
const express = require('express');

// start up an instance of app
const app = express();

// middleware
const bodyParser = require('body-parser')

// here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// cors for cross origin allowance
const cors = require('cors');
app.use(cors()); 

// initialize the main project folder
app.use(express.static('dist'));

// setup Server
const port = 8000;

// spin up the server 
const server = app.listen(port, listening);

function listening() {
    console.log(`running on localhost: ${port}`);
}

// change the home route to use the index file from dist
app.get('/', function (req, res) {
    res.sendFile('dist/index.html');
})

// setup GET route
app.get('/record', getData);

function getData(req, res) {
	res.send(projectData);
}

// setup POST route: the first argument being the URL to make a POST to
app.post('/', postData);

function postData(req, res) {
	projectData.from = req.body.from;
	projectData.to = req.body.to;
	projectData.city = req.body.city;
	projectData.country = req.body.country;
	projectData.weather = req.body.weather;
	projectData.high = req.body.high;
	projectData.low = req.body.low;
}