const apiKey = '82e996c474c47818b1070c70560f1710';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('locationInput');
const locationElement = document.getElementById('city-name');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');
const errorMessage = document.getElementById('error-message');
const weatherInfo = document.getElementById('weather-info');
const mapButton = document.getElementById('map-button');
const mapDiv = document.getElementById('map');
let map;
let marker;

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (location) {
        fetchWeather(location);
    }
});

mapButton.addEventListener('click', () => {
    mapDiv.style.display = 'block';
    mapButton.style.display = 'none';
    if (marker) {
        map.setView(marker.getLatLng(), 10);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const { name, main, weather, coord } = data;
                locationElement.textContent = name;
                temperatureElement.textContent = `${Math.round(main.temp)}°C`;
                descriptionElement.textContent = weather[0].description;
                const iconCode = weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                weatherIcon.src = iconUrl;

                weatherInfo.style.display = 'block';
                mapButton.style.display = 'block';
                errorMessage.textContent = '';

                updateMap(coord.lat, coord.lon, name);
            } else {
                throw new Error(data.message || 'City not found');
            }
        })
        .catch(error => {
            errorMessage.textContent = error.message;
            weatherInfo.style.display = 'none';
            mapButton.style.display = 'none';
        });
}

function updateMap(lat, lon, cityName) {
    if (!map) {
        map = L.map('map').setView([lat, lon], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<b>${cityName}</b>`).openPopup();
    } else {
        map.setView([lat, lon], 10);
        if (marker) {
            marker.setLatLng([lat, lon]);
        } else {
            marker = L.marker([lat, lon]).addTo(map);
        }
        marker.bindPopup(`<b>${cityName}</b>`).openPopup();
    }
}
