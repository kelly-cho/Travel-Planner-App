// global variables
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey  = '&APPID=0e2ec7dc3d32e820f8abdd569b0742b9';

// create a new date instance dynamically with JS
let d = new Date();

// in javascript, month is zero-indexed, so it's month 0-11
let month = d.getMonth() + 1;
let newDate = d.getFullYear() + '-' + month + '-' + d.getDate();

document.getElementById('generate').addEventListener('click', generateEntry);

// get weather info from the api based on the zip entered
function generateEntry(e) {
	const zip = document.getElementById('zip').value;

	if (zip == '')
	{
		alert('Please enter a valid ZIP code!');
		return;
	}

	const feelings = document.getElementById('feelings').value;
	
	getWeather(baseUrl, zip, apiKey) // NO SEMICOLON!!!
	// data is the result returned from the api call
	.then(function(data) {
		postData('/', {date: newDate, location: data.name, temp: data.main.temp, content: feelings});
		updateUI();
	});
}

// async UPDATE UI function
const updateUI = async() => {
	const request = await fetch('/record');

	try {
		const record = await request.json();

		document.getElementById('date').innerHTML = record.date;
		document.getElementById('location').innerHTML = 'Location: ' + record.location;
		document.getElementById('temp').innerHTML = 'Temperature: ' + record.temp + '&degC';
		document.getElementById('content').innerHTML = record.content;

		// reset enter fields
		document.getElementById('zip').value = '';
		document.getElementById('feelings').value = '';

	} catch(error) {
		console.log('error', error);
	}
}

// async GET WEATHER function
const getWeather = async(baseUrl, zip, apiKey) => {
	const response = await fetch(baseUrl + zip + apiKey);

	try {
		const data = await response.json();
		return data;
	} catch(error) {
		console.log('error', error);
	}
}

// async POST function
const postData = async(url = '', data = {}) => {

	const response = await fetch (url, {
	method: 'POST',	// * GET, POST, PUT, DELETE, etc.
	credentials: 'same-origin', // include, *same-origin, omit
	headers: {
		'Content-Type': 'application/json', // indicates that our app run on JSON data
	},
	body: JSON.stringify(data), // body data type must match "Content-Type" header
	});

	try {
		const newData = await response.json();
		return newData;

	} catch(error) {
		console.log('error', error);
	}
}

