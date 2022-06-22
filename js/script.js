// Declaring the variables
let counter = -1;
let lon;
let lat;
let temperature = document.querySelector(".temp");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
let windGust = document.querySelector(".wind-gust");
let windDirection = document.querySelector(".direction");

let uvIndex = document.querySelector(".UV_Index");
let $week = document.querySelector(".week");

let $sunWidget = document.querySelector(".sun-widget");

let line = document.querySelector(".line");
let dayIcon = document.querySelector(".dayIcon");

let summary = document.querySelector(".summary");
let $icon = document.querySelector(".icon");
let inputCity = document.querySelector("#input-city");

inputCity.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    getWeatherData(inputCity.value);
    inputCity.value = "";
    clearInterval(counter);
  }
});

window.addEventListener("load", () => {
});

function getWeatherData(cityName) {
  // API ID
  const api = "d271d082c44757a9bce9c5910fb2ecd3";

  // API URL
  const base = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&exclude=hourly,clouds&appid=${api}`;

  // Calling the API
  fetch(base)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      inputCity.value = data.name + "," + data.sys.country;
      oneCallAPi(data.coord.lat, data.coord.lon);
    });
}

function oneCallAPi(lat, lon) {
  const api = "d271d082c44757a9bce9c5910fb2ecd3";
  let lang = "pt_br";
  let units = "metric";
  const oneBase = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&lang=en&exclude=hourly,minutely&appid=${api}
 `;
  fetch(oneBase)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      temperature.dataset.value = Math.round(data.current.temp) + "°";
      wind.dataset.value = Math.ceil(data.current.wind_speed * 3.6) + "Km/h ";
      if (data.current.wind_gust !== undefined) {
        windGust.dataset.value =
          Math.ceil(data.current.wind_gust * 3.6) + "Km/h ";
      } else {
        windGust.dataset.value = "N/A";
      }
      summary.textContent = data.current.weather[0].description;
      $icon.data = `icons/${data.current.weather[0]["icon"]}.svg`;
      windDirection.dataset.value = data.current.wind_deg + "°";
      windDirection.firstElementChild.style.transform = `rotate(${data.current.wind_deg}deg)`;
      humidity.dataset.value = Math.floor(data.current.humidity) + "%";
      uvIndex.src = `icons/uv-index-${Math.round(data.current.uvi)}.svg`;

      let timezone = data.timezone_offset / 3600;
      $sunWidget.dataset.sunrise = moment(data.current.sunrise * 1000)
        .utcOffset(timezone)
        .format("HH:mm");
      $sunWidget.dataset.sunset = moment(data.current.sunset * 1000)
        .utcOffset(timezone)
        .format("HH:mm");
      let sunrise = convertTime(data.current.sunrise * 1000, timezone);
      let sunset = convertTime(data.current.sunset * 1000, timezone);
      let nextSunrise = convertTime(data.daily["1"].sunrise * 1000, timezone);
      counter = setInterval(() => {
        let currentTime = convertTime(new Date().getTime(), timezone);
        if (currentTime >= sunrise && currentTime <= sunset) {
          $sunWidget.dataset.sunrise = moment(sunrise).format("HH:mm");
          $sunWidget.dataset.sunset = moment(sunset).format("HH:mm");
          DayOrNight(currentTime, "day", sunrise, sunset);
        } else if (currentTime >= sunset && currentTime <= nextSunrise) {
          $sunWidget.dataset.sunrise = moment(sunset).format("HH:mm");
          $sunWidget.dataset.sunset = moment(nextSunrise).format("HH:mm");
          DayOrNight(currentTime, "night", sunset, nextSunrise);
        }
      }, 1000);
      $week.innerHTML = "";
      let oneWeek = Array.from(data.daily);
      oneWeek.shift();
      for (let i = 0; i <= oneWeek.length; i++) {
        let box = document.createElement("div");
        box.className = "box";
        box.setAttribute("data-date", `${setDateTime(oneWeek[i].dt * 1000, "ddd")}`);
        box.setAttribute(
          "data-temp",
          `${Math.round(oneWeek[i].temp.min)}°/${Math.round(
            oneWeek[i].temp.max
          )}°`
        );
        console.log(setDateTime(oneWeek[i].dt, "ddd Do"));
        let img = document.createElement("img");
        img.src = `icons/${oneWeek[i].weather["0"].icon}.svg`;
        box.appendChild(img);
        $week.appendChild(box);
      }
    });
}

function setDateTime(apiValue, format) {
  return moment(apiValue).format(format);
}
function convertTime(time, timeOffset) {
  // create Date object for current location
  var date = new Date();
  // convert to milliseconds, add local time zone offset and get UTC time in milliseconds
  var utcTime = time + date.getTimezoneOffset() * 60000;
  // create new Date object for a different timezone using supplied its GMT offset.
  var NewTime = new Date(utcTime + 3600000 * timeOffset).getTime();
  return NewTime;
}
/****************** */
function DayOrNight(currentTime, period, periodStart, periodEnd) {
  line.setAttribute("class", `line ${period}`);
  let periodLength = periodEnd - periodStart;
  let timeGone = currentTime - periodStart;
  let offset = (timeGone * 301) / periodLength;
  if (offset <= 301) {
    line.style.strokeDashoffset = 603 - offset;
    dayIcon.style.transform = `rotate(${(timeGone * 180) / periodLength}deg)`;
    dayIcon.firstElementChild.src = `icons/${period}.svg`;
    dayIcon.firstElementChild.style.transform = `rotate(-${
      (timeGone * 180) / periodLength
    }deg)`;
  }
}
