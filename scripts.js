const url = "https://api.openweathermap.org";
const apiKey = `393eeb90be3bedb143a4dd6632d378b4`;
const bodyRef = document.querySelector("body");
const weatherBoxRef = document.querySelector(".weather-box");
const cityInputRef = document.querySelector("#cityInput");

function resetStyling() {
  weatherBoxRef.style.opacity = 0;
  bodyRef.className = "default";
}

function getMyLocation() {
  resetStyling();
  navigator.geolocation.getCurrentPosition(showPosition);
}

function getCityLocation() {
  resetStyling();
  getApiDataFromCityName(cityInputRef.value);
}

function cityInputOnKeyDown(e) {
  if (e.keyCode === 13) {
    getCityLocation();
  }
}

function showPosition(position) {
  getApiDataFromLatELon(position.coords.latitude, position.coords.longitude);
}

function getApiDataFromLatELon(latitude, longitude) {
  axios
    .get(addApiKey(`${url}/data/2.5/weather?lat=${latitude}&lon=${longitude}`))
    .then((response) => {
      const data = response.data;

      displayWeather(
        data.name,
        data.main.temp,
        data.main.temp_min,
        data.main.temp_max,
        data.weather[0]
      );
    });
}

function addApiKey(url) {
  return `${url}&appid=${apiKey}`;
}

function getApiDataFromCityName(cityName) {
  axios
    .get(addApiKey(`${url}/geo/1.0/direct?q=${cityName}&limit=1`))
    .then((data) => {
      const coords = data.data[0];
      getApiDataFromLatELon(coords.lat, coords.lon);
    })
    .catch(() => {
      alert("Select a valid location!");
    });
}

function kelvinToCelsius(K) {
  return (K - 273.15).toFixed(1);
}

function displayWeather(cityName, temp, minTemp, maxTemp, weather) {
  const iconSrc = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  weatherBoxRef.innerHTML = `
    <div class='row'>
        <div class='col'>
            <h2>${cityName}</h2>
            <h1 class="current-weather">${kelvinToCelsius(temp)}°C</h1>
        </div>
        <img class='weather-icon' src="${iconSrc}"/>
    </div>
    <div class="min-max">
        <h5>Min: ${kelvinToCelsius(minTemp)}°C</h5>
        <h5>Max: ${kelvinToCelsius(maxTemp)}°C</h5>
    </div>
    `;

  weatherBoxRef.style.opacity = 1;

  bodyRef.className = weather.main;
}
