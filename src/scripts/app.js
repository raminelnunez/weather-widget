const form = document.getElementsByTagName('form')[0];
const button = document.getElementsByTagName('button')[0];

const baseURL = 'http://api.openweathermap.org/data/2.5/';
let apiKey;
const kelvin = 273.15;
const date = new Date();
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let currentWeather;
const weeklyWeather = [];

const html = {
  currrentConditions: document.getElementsByClassName('current-conditions')[0],
  forecast: document.getElementsByClassName('forecast')[0]
};

let lat;
let lon;

if (!navigator.geolocation) {
	console.log('Geolocation is not supported by your browser');
} else {
	navigator.geolocation.getCurrentPosition((position) => {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
	});
};

const getCoords = () => {
  return [lat, lon];
};

function getCurrentWeather() {
  return fetch(`${baseURL}weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => currentWeather = new CurrentWeather(
    data.weather[0].icon, data.main.temp, data.weather[0].description))
    .catch(() => alert(`Please Enter Valid Key`))
    .then(() => document.getElementById('text-input').value = "")
};

function getForecast() {
  return fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => parseForecast(data.list))
  .then(() => render(currentWeather, weeklyWeather));
};

function parseForecast(array) {
  let dates = []
  let datesInfoArray = [[],[],[],[],[]];
  for (let i = 0; i < 5; i++) {
    dates[i] = (date.getDate() + i + 1)
  };
  
  for (let item of array) {
    let itemDate = parseInt(item.dt_txt[8].toString() + item.dt_txt[9].toString());
    for(let i = 0; i < dates.length; i++) {
      if (itemDate === dates[i]) {
        datesInfoArray[i].push(item)
      }
    }
  }

  let weekDayInt = date.getDay();
  let dateInt = date.getDate();
  for (let day of datesInfoArray) {
    weekDayInt++
    dateInt++
    let minTemp = undefined;
    let maxTemp = undefined;
    for (let trihour of day) {
      if (minTemp === undefined || trihour.main.temp_min < minTemp) {
        minTemp = trihour.main.temp_min
      }
      if (maxTemp === undefined || trihour.main.temp_max > maxTemp) {
        maxTemp = trihour.main.temp_max
      }
    }
    let icon = day[parseInt((day.length/2).toFixed(0))].weather[0].icon;
    let description = day[parseInt((day.length/2).toFixed(0))].weather[0].description;
    weeklyWeather.push(new DailyWeather(week[weekDayInt], dateInt, icon, description, maxTemp, minTemp))
  }
};

class CurrentWeather {
  constructor(icon, temperature, description) {
    this.imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    this.temp = temperature;
    this.desc = description;
  };
};

class DailyWeather {
  constructor(day, date, icon, description, maxTemperature, minTemperature) {
    this.day = day;
    this.date = date;
    this.imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    this.desc = description;
    this.maxTemp = maxTemperature;
    this.minTemp = minTemperature;
  };
};

function render(currentWeather, weeklyWeather) {
  html.currrentConditions.innerHTML = "";
  html.currrentConditions.insertAdjacentHTML('afterbegin', `
  <h2>Current Conditions</h2>
  <img src="${currentWeather.imageURL}" />
  <div class="current">
    <div class="temp">${(currentWeather.temp - kelvin).toFixed(0)}℃</div>
    <div class="condition">${currentWeather.desc}</div>
  </div>
  `);

  html.forecast.innerHTML = "";
  weeklyWeather.forEach((day) => {
    html.forecast.insertAdjacentHTML('beforeend', `
    <div class="day">
      <h3>${day.day}</h3>
      <img src="${day.imageURL}" />
      <div class="description">${day.desc}</div>
      <div class="temp">
        <span class="high">${(day.maxTemp - kelvin).toFixed(0)}℃</span>/<span class="low">${(day.minTemp - kelvin).toFixed(0)}℃</span>
      </div>
    </div>
    `);
  });
  html.forecast.insertAdjacentHTML('afterend', `
    <img id="the-thing" src="https://c.tenor.com/CWgfFh7ozHkAAAAC/rick-astly-rick-rolled.gif">
  `)
};

function keyEntered(e) {
  e.preventDefault();
  let key = document.getElementById('text-input').value;
  if (lat === undefined) {
    alert('Please Enable Location')
    return;
  }
  if (key === undefined) {
    alert('Please Enter Key')
    return;
  }
  runApp(key);
}

function runApp(key) {
  apiKey = key;
    getCurrentWeather();
    getForecast();
}

form.addEventListener('submit', keyEntered)
button.addEventListener('click', () => navigator.geolocation.getCurrentPosition((position) => {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}));

