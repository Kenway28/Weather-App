// Declaring the variables
let lon;
let lat;
let $temperature = document.querySelector(".main-temperature");
let $description = document.querySelector(".description");
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
let row = document.querySelector(".time-line");
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
    const api = "your api key";

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
      $description.textContent = data.current.weather[0].description;

      /// time line at launch
      timeLineInfo("week", data);
    })
    .catch((err) => console.log(err));
}

/****************** */

function timeLineInfo(type, data) {
  row.innerHTML = "";

  let rowData = data.daily;
  rowData.shift();
  rowData.pop();
  let formatting = "dddd";

  console.log(data);
  for (let i = 0; i < rowData.length; i++) {
    let box = document.createElement("div");
    box.className = "box";
    let day = document.createElement("div");
    day.className = "day";
    let info = document.createElement("div");
    info.className = "info";
    let text = document.createElement("div");
    text.className = "text";
    let icon = document.createElement("div");
    icon.className = "icon";

    text.innerHTML = `<strong>${Math.round(
      rowData[i]["temp"].max
    )}°</strong>${Math.round(rowData[i]["temp"].min)}° `;

    let positionTime = setTime(rowData[i].dt, data.timezone_offset, formatting);
    day.textContent = positionTime;
    let img = document.createElement("img");
    img.src = `icons/${rowData[i]["weather"][0].icon}.svg`;
    box.appendChild(day);
    info.appendChild(text);
    icon.appendChild(img);
    info.appendChild(icon);
    box.appendChild(info);

    row.appendChild(box);
  }
}

function setTime(timeValue, timezone, format) {
  return `${setDateTime(
    (timeValue + timezone + new Date().getTimezoneOffset() * 60) * 1000,
    format
  )}`;
}
function setDateTime(apiValue, format) {
  return moment(apiValue).format(format);
}
/************* */

row.addEventListener("wheel", function (e) {
  const race = 300; // How many pixels to scroll

  if (e.deltaY > 0)
    // Scroll right
    row.scrollLeft += race;
  // Scroll left
  else row.scrollLeft -= race;
  e.preventDefault();
});
