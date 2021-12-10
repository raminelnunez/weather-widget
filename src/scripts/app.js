const baseURL = 'http://api.openweathermap.org/data/2.5/'
const apiKey = 'a230cd15bf0b29b71caeacb711a2ada6';
const kelvin = 273.15;
let currentWeather;

let lat;
let lon;

if (!navigator.geolocation) {
	console.log('Geolocation is not supported by your browser');
} else {
	navigator.geolocation.getCurrentPosition((position) => {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
    console.log(lat, lon);
    getCurrentWeather();
    getWeeklyWeather();
	});
}

const getCoords = () => {
  return [lat, lon];
}

function getCurrentWeather() {
  return fetch(`${baseURL}weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => currentWeather = new CurrentWeather(
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, data.main.temp, data.weather[0].description))
  .then(console.log(currentWeather))
}

function getForecast() {
  return fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => console.log(data))
}


class CurrentWeather {
  constructor(imageURL, temperature, description) {
    this.image = imageURL;
    this.temp = temperature;
    this.desc = description;
  }
}

class DailyWeather {
  constructor(imageURl, description, maxTemperature, minTemperature) {
    this.image = imageURl;
    this.desc = description;
    this.maxTemp = maxTemperature;
    this.minTemp = minTemperature;
  }
}

