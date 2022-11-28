// api req
let getCityWeather = function (city) {
	// formatting
	let apiUrl =
		'https://api.openweathermap.org/data/2.5/weather?q=' +
		city +
		'&appid=ed53499ef806b361000d58eb45bf7041&units=imperial';
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

// search button handle
let searchSubmitHandler = (event) => {
	event.preventDefault();

	// grab val from input
	let cityName = $('#cityname').val().trim();

	if (cityName) {
		getCityWeather(cityName);

		$('#cityname').val('');
	} else {
		alert('No city name detected! Please enter a city name to continue');
	}
};

// display module
let displayWeather = (weatherData) => {
	$('#main-city-name')
		.text(
			weatherData.name +
				' (' +
				dayjs(weatherData.dt * 1000).format('MM/DD/YYYY') +
				') '
		)
		.append(
			`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`
		);
	$('#main-city-temp').text(
		'Temperature: ' + weatherData.main.temp.toFixed(1) + '°F'
	);
	$('#main-city-humid').text('Humidity: ' + weatherData.main.humidity + '%');
	$('#main-city-wind').text(
		'Wind Speed: ' + weatherData.wind.speed.toFixed(1) + ' mph'
	);

	// grab uv data from api
	fetch(
		'https://api.openweathermap.org/data/2.5/uvi?lat=' +
			weatherData.coord.lat +
			'&lon=' +
			weatherData.coord.lon +
			'&appid=ed53499ef806b361000d58eb45bf7041'
	).then((response) => {
		response.json().then(function (data) {
			// display the uv index value
			$('#uv-box').text(data.value);

			// highlight the value using the EPA's UV Index Scale colors
			if (data.value >= 11) {
				$('#uv-box').css('background-color', '#6c49cb');
			} else data.value < 11 && data.value >= 8 ? $('#uv-box').css('background-color', '#d90011') : data.value < 8 && data.value >= 6 ? $('#uv-box').css('background-color', '#f95901') : data.value < 6 && data.value >= 3 ? $('#uv-box').css(`background-color`, '#f7e401') : $('#uv-box').css('background-color', '#299501');
		});
	});

	// 5-Day forcast API call
	fetch(
		'https://api.openweathermap.org/data/2.5/forecast?q=' +
			weatherData.name +
			'&appid=ed53499ef806b361000d58eb45bf7041&units=imperial'
	).then(function (response) {
		response.json().then(function (data) {
			// clear div
			$('#five-day').empty();

			for (i = 7; i <= data.list.length; i += 8) {
				// insert data into my day forecast card template
				let fiveDayCard = `
                    <div class="col-md-2 m-2 py-3 card text-white bg-secondary">
                        <div class="card-body p-1">
                            <h5 class="card-title">${dayjs(
															data.list[i].dt * 1000
														).format('MM/DD/YYYY')}</h5>
                            <img src="https://openweathermap.org/img/wn/${
															data.list[i].weather[0].icon
														}.png" alt="rain">
                            <p class="card-text">Temp: ${
															data.list[i].main.temp
														}</p>
                            <p class="card-text">Humidity: ${
															data.list[i].main.humidity
														}</p>
                        </div>
                    </div>
                    `;

				// append the day to the five-day forecast
				$('#five-day').append(fiveDayCard);
			}
		});
	});
};

// event handlers
$('#search-form').submit(searchSubmitHandler);
$('#search-history').on('click', function (event) {
	// get the links id value
	let prevCity = $(event.target).closest('a').attr('id');
	// pass it's id value to the getCityWeather function
	getCityWeather(prevCity);
});
