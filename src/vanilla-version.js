const app = document.querySelector(".app");
const errorMessage = document.getElementById("error-message ");
const searchBtn = document.getElementById("searchButton");
const heroContainer = document.querySelector(".hero__container");
const errorContainer = document.querySelector(".error");
const apiKey = "c4527f71d691e7e12d76b81a49767c52";
// const getLocation = new Promise(
//   (resolve) => {
//     return navigator.geolocation.getCurrentPosition(resolve);
//   },
//   (reject) => {
//     console.log("reject");
//     return navigator.geolocation.getCurrentPosition(reject);
//   }
// ).catch((error) => console.log(error));

{
  /* <div class="flex justify-center items-center h-screen" id="autoLoader">
<span class="animate-pulse bg-cyan-300 rounded-full h-20 w-20"></span>
</div> */
}
const getLocation = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(displayError(error.message))
    );
  });
};

function loaderSpiner(className = "block") {
  const html = ` <div class="flex justify-center items-center h-screen ${className}" id="autoLoader">
  <span class="animate-pulse bg-cyan-300 rounded-full h-20 w-20"></span>
</div>`;

  app.innerHTML = "";
  app.insertAdjacentHTML("afterbegin", html);
}

async function setBrowserLocation() {
  //Set loader function

  //fetching the browser location(lat, long)
  const { coords } = await getLocation();
  const { latitude: lat, longitude: lon } = coords;

  //Coverting coords to city name and country
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=c4527f71d691e7e12d76b81a49767c52`
  );

  const [data] = await response.json();
  const { name: cityName } = data;

  getCurrentLocation(cityName);
}

setBrowserLocation();
/*________________________________ Fetching user's location from browser TODO: Convert to Async Await function ________________________________________*/

async function getCurrentLocation(cityName) {
  app.innerHTML = "";
  //hide UI

  try {
    //Fetching the weather data using the city name
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=c4527f71d691e7e12d76b81a49767c52`
    );

    if (response.ok) {
      const data = await response.json();

      if (app.classList.contains("hidden")) app.classList.remove("hidden");
      errorContainer.innerHTML = "";
      console.log(data);
      loaderSpiner();
      setData(data);
    } else {
      throw new Error(JSON.stringify(response.statusText));
    }
  } catch (error) {
    displayError(error);
  }
}

/*________________________________ Set state ________________________________________*/
const setData = async function (data) {
  const state = {
    weekForcast: [],
    daysInWeek: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
  };
  const { name, country, population } = data.city;
  const list = data.list.slice(0, 7);
  const celsiusConvert = 273.15;

  state.region = { name, country, population };
  state.coord = data.city.coord;
  state.windQuality = await windData(state.coord);

  list.forEach((week) => {
    state.weekForcast.push({
      date: week.dt_txt,
      visibility: week.visibility,
      windSpeed: week.wind.speed,
      windDeg: week.wind.deg,
      weather: week.weather[0].description,
      icon: week.weather[0].icon,
      humidity: week.main.humidity,
      pressure: week.main.pressure,
      tempreture: Math.ceil(week.main.temp - celsiusConvert),
    });
  });

  // TODO:how to add icons to markup : http://openweathermap.org/img/w/${icon}.png

  // console.log(windQuality);
  // render html
  renderMarkup(state);
};

/*________________________________ Convert wind degree to readable text format________________________________________*/
const windData = async function ({ lat, lon }) {
  const airQualityValues = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  const res = await fetch(
    `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  const data = await res.json();
  // main.aqi = 1 (Air qaulity good) , 2 = fair
  const { aqi: airIndex } = data.list[0].main;
  return airQualityValues[airIndex - 1];
};

const windDegree = function (degree) {
  if (degree > 360) return ` North `;
  if (degree > 315) return ` Northwest (Northwest wind) `;
  if (degree > 270) return ` West (West wind) `;
  if (degree > 225) return ` Southwest (Southwest wind) `;
  if (degree > 180) return ` South (South wind) `;
  if (degree > 135) return ` Southeast (Southeast wind) `;
  if (degree > 90) return ` East (East wind) `;
  if (degree > 45) return ` Northeast (Northeast wind) `;
  if (degree > 0) return ` North (North wind)`;
};
/*________________________________ Rendering HTML  Markup ________________________________________*/
const renderMarkup = function (data) {
  /**./images/sung-big.png**/
  const { region, weekForcast, daysInWeek } = data;
  console.log(daysInWeek, daysInWeek);
  const currentWeather = data.weekForcast[0];
  console.log(currentWeather);
  app.innerHTML = "";
  const html = `
  <section class="mt-10" id="hero">
  <div class="hero__container">
  <div class="hero__card group bg-white shadow-md">
  <div class="flex items-center justify-between space-x-8">
    <div class="flex flex-col space-y-8 font-semibold">
      <p class="text-xl md:text-3xl font-bold md:font-semibold">
        ${region.name} , ${region.country}
      </p>
      <div class="relative">
        <p class="text-2xl md:text-4xl font-semibold">${
          currentWeather.tempreture
        }c</p>
        <p class="absolute text-xl -top-5 right-20 md:right-32">o</p>
        <p class="text-sm text-gray-400 mt-2">${currentWeather.weather}</p>
      </div>
    </div>

    <img
      src="http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png"
      alt="sunny"
      class="w-20 md:w-32 group-hover:-translate-y-20 transition-all duration-200"
    />
  </div>
  <!--card footer-->
  <div class="hero__card--footer">
    <div
      class="bg-yankeeBlue text-center text-white p-4 space-y-2 rounded-xl"
    >
      <p class="text-sm font-medium">Humidity</p>
      <p class="text-md font-bold">${currentWeather.humidity}%</p>
    </div>
    <div
      class="bg-champagnePink text-center text-black p-4 space-y-2 rounded-xl"
    >
      <p class="text-sm font-medium">Pressure</p>
      <p class="text-md font-bold">${currentWeather.pressure}mb</p>
    </div>
    <div
      class="bg-powderBlue text-center text-black p-4 space-y-2 rounded-xl"
    >
      <p class="text-sm font-medium">Visibility</p>
      <p class="text-md font-bold">${currentWeather.visibility}Km</p>
    </div>
  </div>
</div>
<!------>
<!--Card-->
<div class="hero__card bg-alabaster">
  <div class="flex items-center justify-between space-x-8">
    <div class="flex flex-col space-y-8 font-semibold">
      <p class="text-xl md:text-3xl font-bold md:font-semibold">
        Air Quality
      </p>
      <div class="relative">
        <p class="text-2xl md:text-4xl font-semibold">${
          currentWeather.windDeg
        }</p>

        <p class="text-sm text-gray-400 mt-2">${windDegree(
          currentWeather.windDeg
        )}</p>
      </div>
    </div>
    <img
      src="./images/windy.png"
      alt="sunny"
      class="w-20 md:w-32 group-hover:animate-pulse transition-all duration-300"
    />
  </div>
  <!--card footer-->
  <div class="hero__card--footer">
    <div
      class="bg-diamond text-center text-black p-4 space-y-2 rounded-xl"
    >
      <p class="text-sm font-medium">Wind</p>
      <p class="text-md font-bold">${currentWeather.windSpeed}Km</p>
    </div>
    <div
      class="bg-keyLime text-center text-black p-4 space-y-2 rounded-xl"
    >
      <p class="text-sm font-medium">Qality</p>
      <p class="text-md font-bold">${data.windQuality}</p>
    </div>
    <div
      class="bg-princetonOrange text-center text-black p-4 space-y-2 rounded-xl"
    >
      <p class="text-sm font-medium">Population</p>
      <p class="text-md font-bold">${region.population}</p>
    </div>
  </div>
  </div>
  </div>        
</section>   

<section id="nextWeek" class="week">
<h2>Next Week</h2>

<div class="week_container">
 ${weekForcast
   .map((week) => {
     const data = new Date(week.date);
     const day = data.getDay();
     const hour = Math.floor((data.getTime() / (1000 * 60 * 60)) % 24);
     const minutes = Math.floor((data.getTime() / (1000 * 60)) % 60).toString();
     return ` <div class="week__card">
   <p>${daysInWeek[day]} </p>
   <p>${hour} :${minutes.length <= 1 ? minutes.padStart(2, "0") : minutes} </p>
   <img src="http://openweathermap.org/img/wn/${week.icon}@2x.png" />
   <div class="relative">
     <p>${week.tempreture}</p>
     <p class="absolute text-sm -top-3 left-3">o</p>
   </div>
 </div>`;
   })
   .join("")}
 
  

</div>
</section>

                `;

  console.log(data);
  loaderSpiner("hidden");
  app.insertAdjacentHTML("afterbegin", html);
};
/*________________________________ Display Error ________________________________________*/
const displayError = function (error) {
  errorContainer.innerHTML = "";

  heroContainer.classList.add("hidden");
  console.log(error);
  const html = `<div class="error-message"> <p> ${error}</p> </div>`;
  errorContainer.insertAdjacentHTML("afterbegin", html);
};
/*________________________________ Get weather data  API ________________________________________*/
const getWeatherData = async function (city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c4527f71d691e7e12d76b81a49767c52`
    );

    const data = await res.json();

    setData(data);
  } catch (error) {
    console.log(`Oops!! ${error}`);
  }
};

/*________________________________ Validate user input data _____________________________________
const validateInputUser = function (inputUser) {
  validRegEx = /^[^\\\/&$#_)(*&^%$#@!~><)]*$/;
  return inputUser.match(validRegEx);
};___*/

/*________________________________ Markup ________________________________________*/
// const renderMarkup = function () {
//   console.log(state);
// };

/*________________________________ Handler function __________________________________
const handler = function (event) {
  event.preventDefault();
  const inputUser = document.getElementById("inputUser").value.trim();
  errorMessage.innerHTML = "";

  if (!validateInputUser(inputUser) || inputUser === "") {
    errorMessage.innerHTML = " Oops!! Invalid city name";
    return;
  }
  getCurrentLocation(inputUser);
};
______*/
/*________________________________Events➡️ ______________________________________

searchBtn.addEventListener("click", function (e) {
  handler(e);
});

document.getElementById("inputUser").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handler(e);
  }
});
__*/
