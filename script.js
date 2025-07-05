const timeEL = document.getElementById("time");
const dateEL = document.getElementById("date");
const currentweatherItemsEL = document.getElementById("current-weather-items");
const timezone = document.getElementById("timezone");
const countryEL = document.getElementById("country");
const weatherforecastEL = document.getElementById("weather-forecast");
const currenttempEL = document.getElementById("current-temp");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];



const API_KEY = "af9438b533f1cbc25caaaa593a76a2c6";

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEL.innerHTML =
    hoursIn12HrFormat + ":" + minutes + "" + `<span id="am-pm">${ampm}</span>`;

  dateEL.innerHTML = days[day] + ", " + date + " " + months[month];
}, 1000);

function showForecast(data) {
  let forecastHTML = "";

  const filtered = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  filtered.forEach((day, index) => {
    const date = new Date(day.dt_txt);
    const dayName = days[date.getDay()];
    const temp = day.main.temp;
    const icon = day.weather[0].icon;
    const desc = day.weather[0].description;

    if (index === 0) {
      currenttempEL.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" class="w-icon">
        <div class="other">
          <div class="day">${dayName}</div>
          <div class="temp">Temp: ${temp}°C</div>
          <div class="desc">${desc}</div>
        </div>`;
    } else {
      forecastHTML += `
        <div class="weather-forecast-item">
          <div class="day">${dayName}</div>
          <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="w-icon" alt="${desc}">
          <div class="temp">${temp}°C</div>
          <div class="desc">${desc}</div>
        </div>`;
    }
  });

  weatherforecastEL.innerHTML = forecastHTML;
}


function getWeatherData() {
  navigator.geolocation.getCurrentPosition((success) => {
    let { latitude, longitude } = success.coords;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("Script loaded...");

        showWeatherData(data);
      });

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Forecast Data:", data);
        showForecast(data); // ✅ Make sure this line comes AFTER showForecast() is defined
      });
  });
}

getWeatherData();

function showWeatherData(data) {
  const { temp, humidity } = data.main;
  const { speed: wind_speed } = data.wind;
  const { sunrise, sunset } = data.sys;

  currentweatherItemsEL.innerHTML = `
    <div class="weather-item"><div>Temperature</div><div>${temp}</div></div>
    <div class="weather-item"><div>Humidity</div><div>${humidity}%</div></div>
    <div class="weather-item"><div>Wind Speed</div><div>${wind_speed} m/s</div></div>
    <div class="weather-item"><div>Sunrise</div><div>${window
      .moment(sunrise * 1000)
      .format("HH:mm a")} </div></div>
    <div class="weather-item"><div>Sunset</div><div>${window
      .moment(sunset * 1000)
      .format("HH:mm a")} </div></div>
  `;


}

function searchCity() {
  const city = document.getElementById("city-input").value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  // Fetch current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      console.log("City Weather Data:", data);
      showWeatherData(data);
    })
    .catch((err) => {
      alert("City not found. Please try again.");
      console.error(err);
    });

  // Fetch forecast
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then((res) => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then((data) => {
      console.log("City Forecast Data:", data);
      showForecast(data);
    })
    .catch((err) => {
      console.error(err);
    });
}



