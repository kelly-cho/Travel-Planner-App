// get weather info from the api based on the city name entered
function generateEntry(e) {
	const baseUrl = 'http://api.geonames.org/searchJSON?q=';
	const username  = '&maxRows=10&username=udacity';

	// create a new date instance dynamically with JS
	let d = new Date();

	// in javascript, month is zero-indexed, so it's month 0-11
	let month = d.getMonth() + 1;
	let newDate = d.getFullYear() + '-' + month + '-' + d.getDate();

	const city = document.getElementById('city').value;

	if (city == '')
	{
		alert('Please enter a valid city name!');
		return;
	}

	getWeather(baseUrl, city, username) // NO SEMICOLON!!!
	// data is the result returned from the api call
	.then(function(result) {
		const data = result.geonames[0];
		postData('http://localhost:8000', {date: newDate, location: data.toponymName, temp: data.countryName, content: data.lng});

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

		document.getElementById('date').innerHTML = record.date;
		document.getElementById('location').innerHTML = 'City: ' + record.location;
		document.getElementById('temp').innerHTML = 'Country: ' + record.temp;
		document.getElementById('content').innerHTML = record.content;

		// reset enter fields
		document.getElementById('city').value = '';

	} catch(error) {
		console.log('error', error);
	}
}

// async GET WEATHER function
const getWeather = async(baseUrl, city, username) => {
	const response = await fetch(baseUrl + city + username);

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



export {
	generateEntry,
	updateUI,
	getWeather,
	postData
}