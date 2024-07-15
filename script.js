let currentCity = "";
let units = "metric";
const API_KEY = "f53eec14443ef05d6d6784e31899ea4e";

let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime p");
let weatherForecast = document.querySelector(".weather__forecast p");
let weatherTemperature = document.querySelector(".weather__temperature");
let weatherIcon = document.querySelector(".weather__icon img");
let weatherMinmax = document.querySelector(".weather__minmax");
let weatherRealfeel = document.querySelector(".weather__realfeel");
let weatherHumidity = document.querySelector(".weather__humidity");
let weatherWind = document.querySelector(".weather__wind");
let weatherPressure = document.querySelector(".weather__pressure");
let weatherSearch = document.querySelector(".weather__search");
function showLocationPopup() {
    const locationPopup = document.getElementById("locationPopup");
    locationPopup.style.display = "block";

  
    document.getElementById("allowLocation").addEventListener("click", () => {
        locationPopup.style.display = "none";
        requestLocationPermission();
    });

  
    document.getElementById("denyLocation").addEventListener("click", () => {
        locationPopup.style.display = "none";
    
    });
}
weatherSearch.addEventListener("submit", (e) => {
    let search = document.querySelector(".weather__searchform");
    e.preventDefault();
    currentCity = search.value;
    getWeather();
    search.value = "";
});


document.querySelector(".unit__celsius").addEventListener("click", () => {
    if (units !== "metric") {
        units = "metric";
        getWeather();
    }
});

document.querySelector(".unit__fahrenheit").addEventListener("click", () => {
    if (units !== "imperial") {
        units = "imperial";
        getWeather();
    }
});


function convertCountryCode(country) {
    let regionName = new Intl.DisplayNames(["en"], { type: "region" });
    return regionName.of(country);
}


function convertTimestamp(timestamp, timezone) {
    const convertTimeZone = timezone / 3600;
    const date = new Date(timestamp * 1000);
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: `Etc/GMT${convertTimeZone >= 0 ? "-" : "+"}${Math.abs(convertTimeZone)}`,
        hour12: true,
    };
    return date.toLocaleString('en-US', options);
}


function getWeather() {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=${units}`;
    if (currentCity) {
        apiUrl += `&q=${currentCity}`;
    } else {
      
        showLocationPopup();
        return;
    }
    fetchWeatherData(apiUrl);
}

function fetchWeatherData(apiUrl) {
    fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimestamp(data.dt, data.timezone);
            weatherForecast.innerHTML = `${data.weather[0].main}`;
            weatherTemperature.innerHTML = `${data.main.temp.toFixed()}&deg`;
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            weatherMinmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&deg</p><p>Max: ${data.main.temp_max.toFixed()}&deg</p>`;
            weatherRealfeel.innerHTML = `${data.main.feels_like.toFixed()}&deg`;
            weatherHumidity.innerHTML = `${data.main.humidity.toFixed()}%`;
            weatherWind.innerHTML = `${data.wind.speed}${units === "imperial" ? "mph" : "m/s"}`;
            weatherPressure.innerHTML = `${data.main.pressure} hPa`;
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
        });
}
function requestLocationPermission() {
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state === 'granted') {
            
            getLocation();
        } else if (permissionStatus.state === 'prompt') {
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                   
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`);
                },
                (error) => {
                    console.error("Error getting location:", error);
                 
                }
            );
        } else {
            
            console.log('Geolocation permission denied or other state:', permissionStatus.state);
        }
    });
}

window.addEventListener("load", () => {
    if (!currentCity) {
      
        showLocationPopup();
    } else {
        getWeather();
    }
});