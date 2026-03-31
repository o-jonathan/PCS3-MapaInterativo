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

var map = L.map('map', {
    boxZoom: false,

    center: center,
    maxBounds: borders,
    maxBoundsViscosity: 0.9,

    zoom: 18
});

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 18,
    maxZoom: 21,
    attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'jpg'
}).addTo(map);

async function loadMarkers() {
    try {
        const response = await fetch('./data/markers.json');
        const data = await response.json();
        data.forEach(el => {
            switch (el.type) {
                case 'marker':
                    L.marker(el.location, { icon: L.icon({ iconUrl: './assets/icons/' + el.id + '.svg', iconSize: [32, 32], iconAnchor: [16, 16], tooltipAnchor: [16, 0] }) })
                        .bindTooltip(el.name)
                        .on('click', () => openDoors(el))
                        .addTo(map);
                    break;

                case 'area':
                    L.polygon(el.locations)
                        .addTo(map);
                    break;

                default:
                    break;
            }
        });
    }
    catch (error) {
        console.error('Falha ao carregar marcadores!\n', error);
    }
}

loadMarkers();

/////////////////////////////////////////////////////////////////////////////////////////////

map.on('click', function (e) {
    if (e.originalEvent.shiftKey) {
        const { lat, lng } = e.latlng;
        const text = lat + ', ' + lng;
        navigator.clipboard.writeText(text);
    }
})

function openDoors(el) {
    map.once('moveend', async () => {
        const div = document.createElement('div');
        div.id = 'room#' + el.id;
        div.classList.add('room')

        const clsbtn = document.createElement('button');
        clsbtn.classList.add('room-back')
        clsbtn.textContent = '<';
        clsbtn.addEventListener('click', () => {
            document.getElementById(`room#${el.id}`).remove();
            map.flyTo(center, 18);
        })

        const bg = document.createElement('img');
        bg.classList.add('room-bg')
        bg.src = './assets/rooms/' + el.id + '.jpeg';
        bg.onerror = () => {
            bg.onerror = null;
            bg.src = './assets/rooms/std.jpeg';
        }

        try {
            const response = await fetch('./data/' + el.id + '.json');
            const data = await response.json();

            data.forEach(mkr => {

                // marker container
                const mkrDiv = document.createElement('div');
                mkrDiv.classList.add('r-marker');
                mkrDiv.style.top = mkr.location[0];
                mkrDiv.style.left = mkr.location[1];

                // marker image
                const img = document.createElement('img');
                img.src = mkr.image;
                img.classList.add('marker-img');

                // popup container
                const popup = document.createElement('div');
                popup.classList.add('marker-popup');

                popup.innerHTML = `
            <h4>${mkr.name}</h4>
            <hr>
            <p>${mkr.description}</p>
        `;

                // assemble
                mkrDiv.appendChild(img);
                mkrDiv.appendChild(popup);
                div.appendChild(mkrDiv);
            });

        }
        catch (error) {
            console.log(error);
        }

        div.append(clsbtn);
        div.append(bg);
        document.body.appendChild(div);
    })

    map.flyTo(el.location, 22)
}