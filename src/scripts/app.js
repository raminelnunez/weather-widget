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
	});
}

const getCoords = () => {
  return [lat, lon];
}
