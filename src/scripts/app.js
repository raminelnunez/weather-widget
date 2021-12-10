const baseURL = 'http://api.openweathermap.org/data/2.5/'
const apiKey = 'a230cd15bf0b29b71caeacb711a2ada6';
const kelvin = 273.15;
const date = new Date();
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
let currentWeather;
const weeklyWeather = [];

const html = {
  currrentConditions: document.getElementsByClassName('current-conditions')[0],
  forecast: document.getElementsByClassName('forecast')[0]
}

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
    getForecast();
	});
}

const getCoords = () => {
  return [lat, lon];
}

function getCurrentWeather() {
  return fetch(`${baseURL}weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => currentWeather = new CurrentWeather(
    `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`, data.main.temp, data.weather[0].description));
}

function getForecast() {
  return fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => parseForecast(data.list, 6))
  .then(() => console.log(weeklyWeather))
  .then(() => render(currentWeather, weeklyWeather));
}

function parseForecast(array, howMany) {
  for (let i = 1; i < howMany; i++) {
    let dailyWeather = new DailyWeather(week[date.getDay() -1 + i],
      `http://openweathermap.org/img/wn/${array[i].weather[0].icon}@2x.png`,
      array[i].weather[0].description,
      array[i].main.temp_max,
      array[i].main.temp_min
    )
    weeklyWeather.push(dailyWeather);
  }
}

class CurrentWeather {
  constructor(imageURL, temperature, description) {
    this.image = imageURL;
    this.temp = temperature;
    this.desc = description;
  }
}

class DailyWeather {
  constructor(day, imageURl, description, maxTemperature, minTemperature) {
    this.day = day;
    this.image = imageURl;
    this.desc = description;
    this.maxTemp = maxTemperature;
    this.minTemp = minTemperature;
  }
}

function render(currentWeather, weeklyWeather) {
  html.currrentConditions.innerHTML = "";
  html.currrentConditions.insertAdjacentHTML('afterbegin', `
  <h2>Current Conditions</h2>
  <img src="${currentWeather.image}" />
  <div class="current">
    <div class="temp">${(currentWeather.temp - kelvin).toFixed(0)}℃</div>
    <div class="condition">${currentWeather.desc}</div>
  </div>
  `)

  html.forecast.innerHTML = "";
  weeklyWeather.forEach((day) => {
    html.forecast.insertAdjacentHTML('beforeend', `
    <div class="day">
      <h3>${day.day}</h3>
      <img src="${day.image}" />
      <div class="description">${day.desc}</div>
      <div class="temp">
        <span class="high">${(day.maxTemp - kelvin).toFixed(0)}℃</span>/<span class="low">${(day.minTemp - kelvin).toFixed(0)}℃</span>
      </div>
    </div>
    `)
  })
}