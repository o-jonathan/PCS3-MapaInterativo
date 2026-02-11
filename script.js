const borders = [
    [-28.239057466703663, -52.360110462617754],
    [-28.241515486440136, -52.35980740662215],
    [-28.241312229263894, -52.35702894634385],
    [-28.23871479265864, -52.35736670056089]
];

const center = borders.reduce(
  (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
  [0, 0]
).map(v => v / borders.length);

var map = L.map('map').setView(center, 18);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'jpg'
}).addTo(map);

/////////////////////////////////////////////////////////////////////////////////////////////

map.on('click', function (e) {
  if (e.originalEvent.shiftKey) {
    const { lat, lng } = e.latlng;
    const text = lat + ', ' + lng;
    navigator.clipboard.writeText(text);
  }
})