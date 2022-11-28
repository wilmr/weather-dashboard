// api req
let getCityWeather = function (city) {
	// formatting
	let apiUrl =
		'https://api.openweathermap.org/data/2.5/weather?q=' +
		city +
		'&appid=d0ee7249b98d8810c8a4df35137aeefb&units=imperial';
	// actual req
	fetch(apiUrl)
		.then(function (response) {
			if (response.ok) {
				response.json().then(function (data) {
					displayWeather(data);
				});
			} else {
				alert('Error: ' + response.statusText);
			}
		})

		// alert user if there is no responce from OpenWeather
		.catch(function (error) {
			alert('could not establish connection to API');
		});
};
