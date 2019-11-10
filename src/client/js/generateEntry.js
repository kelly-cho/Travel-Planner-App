const newEntry = {};

// get weather info from the api based on the city name entered
function generateEntry(e) {
	const baseUrl = 'http://api.geonames.org/searchJSON?q=';
	const username  = '&maxRows=10&username=udacity';

	// create a new date instance dynamically with JS
	let d = new Date();

	// in javascript, month is zero-indexed, so it's month 0-11
	let month = d.getMonth() + 1;
	let today = d.getFullYear() + '-' + month + '-' + d.getDate();

	const city = document.getElementById('input-city').value;
	const fromDate = document.getElementById('input-from').value;
	const toDate = document.getElementById('input-to').value;
	alert(fromDate + " " + toDate);

	if (city == '')
	{
		alert('Please enter a valid city name!');
		return;
	}

	getLocation(baseUrl, city, username) // NO SEMICOLON!!!
	// data is the result returned from the api call
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
		newEntry.lng = data.lng;
		newEntry.lat = data.lat;

	})
	.then(function() {
		postData('http://localhost:8000', newEntry);
	})
	.then(function() {
		updateUI();
	});

}

// async UPDATE UI function
const updateUI = async() => {
	const request = await fetch('http://localhost:8000/record');

	try {
		const record = await request.json();

		document.getElementById('date').innerHTML = record.from;
		document.getElementById('location').innerHTML = 'City: ' + record.city;
		document.getElementById('temp').innerHTML = 'Country: ' + record.country;
		document.getElementById('lng').innerHTML = 'Longitude: ' + record.lng;
		document.getElementById('lat').innerHTML = 'Latitude: ' + record.lat;

		// reset enter fields
		document.getElementById('input-city').value = '';
		document.getElementById('input-from').value = '';
		document.getElementById('input-to').value = '';

	} catch(error) {
		console.log('error in updateUI()', error);
	}
}

// async GET WEATHER function
const getLocation = async(baseUrl, city, username) => {
	const response = await fetch(baseUrl + city + username);

	try {
		const data = await response.json();
		return data;
	} catch(error) {
		console.log('error in getWeather()', error);
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



export {
	generateEntry,
	updateUI,
	getLocation,
	postData
}