const newEntry = {};

// get weather info from the api based on the city name entered
function generateEntry(e) {

	document.getElementById('display').innerHTML = 'Loading...';

	const genoUrl = 'http://api.geonames.org/searchJSON?q=';
	const username  = '&maxRows=10&username=udacity';

	// use the cors-anywhere API to fix the CORS error 
	// source: https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
	const dskyUrl = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/';
	const apikey = 'a4617a54dc1452d58ec269b461e2d4c5/';

	const imgUrl = 'https://pixabay.com/api/?key=14231861-b5b623e0f265e9e5bcfccc7a4&q=';
	const mediaType = '&image_type=photo';

	// create a new date instance dynamically with JS
	let d = new Date();

	// in javascript, month is zero-indexed, so it's month 0-11
	let month = d.getMonth() + 1;
	let today = d.getFullYear() + '-' + month + '-' + d.getDate();

	// get user input
	const city = document.getElementById('input-city').value;
	const fromDate = document.getElementById('input-from').value;
	const toDate = document.getElementById('input-to').value;

	if (city == '')
	{
		alert('Please enter a valid city name!');
		return;
	}

	getLocation(genoUrl, city, username) // NO SEMICOLON!!!
	// parameter is the "result" returned from the call to getLocation()
	.then(function(result) {
		if(result.totalResultsCount == 0) {
			alert('Please enter a valid city name!');
			return;
		}

		const data = result.geonames[0];

		newEntry.from = fromDate;
		newEntry.to = toDate;
		newEntry.city = data.toponymName;
		newEntry.country = data.countryName;

		// sends longtitude and latitude to the Darksky API
		// T00:00:00 is the time format the request takes in
		return data.lat + ',' + data.lng + ',' + newEntry.from + 'T00:00:00';
	})
	.then(function(location) {
		return getWeather(dskyUrl, apikey, location);
	})
	.then(function(result) {
		newEntry.weather = result.daily.data[0].summary;
		newEntry.high = result.daily.data[0].temperatureHigh;
		newEntry.low = result.daily.data[0].temperatureLow;

		console.log(newEntry.weather + " " + newEntry.high + " " + newEntry.low);

		postData('http://localhost:8000', newEntry);
	})
	.then(function() {
		updateUI();
	})
	.then (function() {
		getImage(imgUrl, newEntry.city, mediaType);
		document.getElementById('display').innerHTML = '';
	});
}

// async GET LOCATION function
const getLocation = async(baseUrl, city, username) => {
	const response = await fetch(baseUrl + city + username);

	try {
		const data = await response.json();
		return data;
	} catch(error) {
		console.log('error in getLocation()', error);
	}
}

// async GET WEATHER function
const getWeather = async(baseUrl, key, location) => {
	const response = await fetch(baseUrl + key + location);

	try {
		const data = await response.json();
		return data;
	} catch(error) {
		console.log('error in getWeather()', error);
	}
}

// async GET IMAGE function
const getImage = async(baseUrl, location, type) => {
	console.log(baseUrl + location + type)
	const response = await fetch(baseUrl + location + type);

	try {
		const data = await response.json();
		document.getElementById('img').src = data.hits[0].webformatURL;
		return data;
		
	} catch(error) {
		console.log('error in getImage()', error);
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
		console.log('error in postData()', error);
	}
}

// async UPDATE UI function
const updateUI = async() => {
	const request = await fetch('http://localhost:8000/record');

	try {
		const record = await request.json();

		document.getElementById('date').innerHTML = record.from + ' - ' + record.to;
		document.getElementById('location').innerHTML = 'City: ' + record.city + ', ' + record.country;
		document.getElementById('weather').innerHTML = 'Weahter: ' + record.weather;
		document.getElementById('temp').innerHTML = 'Temperature: ' + record.low + '&degF - ' + record.high + '&degF';

		// reset enter fields
		document.getElementById('input-city').value = '';
		document.getElementById('input-from').value = '';
		document.getElementById('input-to').value = '';

	} catch(error) {
		console.log('error in updateUI()', error);
	}
}

function addListener() {
	document.getElementById('generate').addEventListener('click', generateEntry);
}

export {
	generateEntry,
	getLocation,
	getWeather,
	getImage,
	postData,
	updateUI,
	addListener
}