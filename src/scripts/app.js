const baseURL = 'http://api.openweathermap.org/data/2.5/'
const apiKey = 'a230cd15bf0b29b71caeacb711a2ada6';

let lat;
let lon;

if (!navigator.geolocation) {
	console.log('Geolocation is not supported by your browser');
} else {
	navigator.geolocation.getCurrentPosition((position) => {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
    console.log(lat, lon);
    getWeather();
	});
}

const getCoords = () => {
  return [lat, lon];
}

function getWeather() {
  return fetch(`${baseURL}weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
  .then((response) => response.json())
  .then((data) => console.log(data.main))
}