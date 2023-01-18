// Declaring the variables
let lon;
let lat;
let $temperature = document.querySelector(".main-temperature");
let $main_icon = document.querySelector(".main-icon");
let $position = document.querySelector(".position");
let $feels_like = document.querySelector(".feels-like");
let $wind = document.querySelector(".wind");
let $humidity = document.querySelector(".humidity");
let $sunrise = document.querySelector(".sunrise");
let $sunset = document.querySelector(".sunset");
let $clock = document.querySelector(".clock");
let $timeList = document.querySelectorAll("ul li");
let counter;
// let $input = document.querySelector("input");
let row = document.querySelector(".row");
window.addEventListener("load", () => {
  console.log();
  if (localStorage.getItem("myWeather") != null) {
    getWeatherData(localStorage.getItem("myWeather"));
  }
});

$position.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    if ($position.value == "") {
    } else {
      getWeatherData($position.value);
    }
  }
});
$position.addEventListener("blur", (event) => {
  if ($position.value == "") {
  } else {
    getWeatherData($position.value);
  }
});
async function getWeatherData(cityName) {
  try {
    // API IDd271d082c44757a9bce9c5910fb2ecd3
    const api = "d271d082c44757a9bce9c5910fb2ecd3";

    // API URL
    const base = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&exclude=hourly,clouds&appid=${api}`;

    // Calling the API

    let response = await fetch(base);
    let cityData = await response.json();

    $position.value = cityData.name + "," + cityData.sys.country;
    localStorage.setItem(
      "myWeather",
      cityData.name + "," + cityData.sys.country
    );
    console.log(localStorage.getItem("myWeather"));

    oneCallAPi(cityData.coord.lat, cityData.coord.lon);
  } catch (error) {
    if (error.toString().includes("country")) {
    }
    console.log(error);
  }
}

function oneCallAPi(lat, lon) {
  const api = "d271d082c44757a9bce9c5910fb2ecd3";
  let lang = "pt_br";
  let units = "metric";
  const oneBase = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&lang=en&exclude=minutely&appid=${api}
 `;
  fetch(oneBase)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $temperature.textContent = `${Math.round(data.current.temp)}°`;
      $main_icon.src = `icons/${data.current.weather[0]["icon"]}.svg`;
      $feels_like.textContent = `${Math.round(data.current.feels_like)}°C`;
      $wind.textContent = `${Math.ceil(data.current.wind_speed * 3.6)} Km/h `;
      $humidity.textContent = Math.floor(data.current.humidity) + "%";
      $sunrise.textContent = setTime(
        data.current.sunrise,
        data.timezone_offset,
        "HH:mm"
      );
      $sunset.textContent = setTime(
        data.current.sunset,
        data.timezone_offset,
        "HH:mm"
      );
      clearInterval(counter);
      counter = setInterval(() => {
        let currentTime = new Date().getTime() / 1000;
        $clock.textContent = setTime(
          currentTime,
          data.timezone_offset,
          "HH:mm"
        );
      }, 1000);

      /// time line at launch
      timeLineInfo("today", data);
      $timeList.forEach((e) => {
        e.addEventListener("click", () => {
          $timeList.forEach((e) => {
            $timeList.forEach((el) => {
              el.classList.remove("active");
            });
          });
          e.classList.add("active");
          timeLineInfo(e.textContent.toLocaleLowerCase(), data);
        });
      });
    })
    .catch((err) => console.log(err));
}

function setDateTime(apiValue, format) {
  return moment(apiValue).format(format);
}

/****************** */

function timeLineInfo(type, data) {
  row.innerHTML = "";
  let rowData = [];
  let formatting = "";
  if (type == "today") {
    rowData = data.hourly;
    formatting = "HH:mm";
  } else {
    rowData = data.daily;
    formatting = "ddd";
  }
  console.log(data);
  for (let i = 0; i < rowData.length; i++) {
    let box = document.createElement("div");
    box.className = "box";
    if (type == "today") {
      box.setAttribute("temp", `${Math.round(rowData[i].temp)}°`);
    } else {
      box.setAttribute(
        "temp",
        `${Math.round(rowData[i]["temp"].min)}° ${Math.round(
          rowData[i]["temp"].max
        )}°`
      );
    }
    let positionTime = setTime(rowData[i].dt, data.timezone_offset, formatting);
    box.setAttribute("time", positionTime);
    let img = document.createElement("img");
    img.src = `icons/${rowData[i]["weather"][0].icon}.svg`;
    box.appendChild(img);
    row.appendChild(box);
  }
}

function setTime(timeValue, timezone, format) {
  return `${setDateTime(
    (timeValue + timezone + new Date().getTimezoneOffset() * 60) * 1000,
    format
  )}`;
}

/************* */
