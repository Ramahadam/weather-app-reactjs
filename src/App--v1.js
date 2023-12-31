import { useEffect, useState } from "react";

const tempNextWeekTemp = [
  {
    day: "Sat",
    temp: 19,
    image: "./images/sunnysmall.png",
  },
  {
    day: "Sat",
    temp: 19,
    image: "./images/cloudy.png",
  },
  {
    day: "Sat",
    temp: 19,
    image: "./images/veryclear.png",
  },
  {
    day: "Sat",
    temp: 19,
    image: "./images/rainy.png",
  },
  {
    day: "Sat",
    temp: 19,
    image: "./images/veryclear.png",
  },
];

const cities = [
  { name: "Sharjah", temp: 33, tempDescription: "Sunny day" },
  { name: "Ajman", temp: 33, tempDescription: "Sunny day" },
  { name: "Abu Dhabi", temp: 33, tempDescription: "Sunny day" },
];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const apiKey = "c4527f71d691e7e12d76b81a49767c52";

/**
 * TODO
 * New Feature for fetching weather tempreture for neghbouring countries
 *
 * https://restcountries.eu/rest/v2/name/${country} for neibouring counries
 *
 */

export default function App() {
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [tempData, setTempData] = useState({});
  const [airQuality, setAirQuality] = useState("");
  const [nextWeekTemp, setNextWeekTemp] = useState(tempNextWeekTemp);
  const [filterResult, setFilterResult] = useState(5);

  function handleTempData({ city, list }) {
    const celsiusConvert = 273.15;
    if (!city && !list) return;

    const newTemp = {
      id: city.id,
      name: city.name,
      country: city.country,
      coords: city.coord,
      population: city.population,
      weekForcasting: list?.slice(0, filterResult).map((week) => {
        return {
          date: week.dt_txt,
          visibility: week.visibility,
          windSpeed: week.wind.speed,
          windDeg: week.wind.deg,
          weather: week.weather[0].description,
          icon: week.weather[0].icon,
          humidity: week.main.humidity,
          pressure: week.main.pressure,
          tempreture: Math.ceil(week.main.temp - celsiusConvert),
        };
      }),
    };

    setTempData((tempreture) => newTemp);
    getAirQuality(newTemp.coords.lat, newTemp.coords.lon);
    setNextWeekTemp((tempreture) => newTemp.weekForcasting);
  }

  function handleFilterResult(value) {
    setFilterResult((val) => value);
  }

  //Fetching browser location
  // useFetchBrowserLocation();
  useEffect(function () {
    function getCurrentLocation() {
      setError("");
      navigator.geolocation.getCurrentPosition(
        (postion) => convertCoordsToCity(postion),
        (err) => setError(err.message)
      );
    }

    //Convert current coords to city name.
    async function convertCoordsToCity(postion) {
      try {
        setError("");
        const res = await fetch(
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${postion.coords.latitude}&lon=${postion.coords.longitude}&appid=${apiKey}`
        );
        const data = await res.json();
        const { name } = data[0];
        setQuery(name);
      } catch (err) {
        setError(err.message);
      }
    }

    getCurrentLocation();
  }, []);

  //Fetching weather data
  useEffect(
    function () {
      //Cleaning up data fetching
      const controller = new AbortController();

      async function fetchWeather() {
        setError("");
        try {
          if (!query) return;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error(`Oops!! something went worng😢`);

          const data = await res.json();
          handleTempData(data);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        }
      }

      fetchWeather();

      return function () {
        controller.abort();
      };
    },
    [query, filterResult]
  );

  //Fetch Air Quality
  const getAirQuality = async function (lat, lon) {
    const quality = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    const res = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    const data = await res.json();
    // main.aqi = 1 (Air qaulity good) , 2 = fair
    const { aqi: airIndex } = data.list[0].main;
    return setAirQuality(quality[airIndex - 1]);
  };

  return (
    <main className="relative">
      <Navbar>
        <Logo />
        <Search onSetQuery={setQuery} />
        <Greeting />
      </Navbar>

      {error && <ErrorMessage err={error} onSetError={setError} />}
      {Object.keys(tempData).length && (
        <>
          <Temperature>
            <CurrentWeather tempData={tempData} />
            <CurrentAirQuality
              tempData={tempData}
              setError={setError}
              airQuality={airQuality}
            />
          </Temperature>
          <NextWeekForcast
            nextWeekTemp={nextWeekTemp}
            onFilterResult={handleFilterResult}
          />
          <Cities />
        </>
      )}
    </main>
  );
}

function Navbar({ children }) {
  return <nav className="container">{children}</nav>;
}

function Logo() {
  return (
    <>
      <img src="./images/logo.png" alt="logo" />;
    </>
  );
}

function ErrorMessage({ err, onSetError }) {
  return (
    <div className="absolute left-2/4 transform  -translate-x-2/4 z-50 bg-slate-100 rounded-md max-w-md mx-auto w-96 h-32  p-4">
      <button onClick={() => onSetError("")} className="float-right">
        ❌
      </button>
      <p>Oops!! &nbsp; {err}</p>
    </div>
  );
}

function Search({ onSetQuery }) {
  function handelFrom(e) {
    e.preventDefault();
    onSetQuery((val) => e.target.value);
  }

  return (
    <div className="search-container">
      <form action="" id="form" className="">
        <input
          type="text"
          placeholder="Search for city weather"
          className="bg-transparent text-black placeholder:text-gray-400 focus:outline-none placeholder:text-sm"
          onChange={handelFrom}
        />
        <a href="https:www.something.com" id="searchButton">
          <img src="./images/search.png" alt="search icon" />
        </a>
      </form>
    </div>
  );
}

function Greeting() {
  const date = new Date();
  const option = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return (
    <div className="flex flex-col text-center md:text-left">
      <span className="font-bold text-sm">Good morning</span>
      <span className="font-normal text-xs">
        {date.toLocaleString("us-EN", option)}
      </span>
    </div>
  );
}

function CurrentWeather({ tempData }) {
  const { visibility, weather, icon, humidity, pressure, tempreture } =
    tempData.weekForcasting[0];
  return (
    <div className="hero__card group bg-white shadow-md">
      <div className="flex items-center justify-between space-x-8">
        <div className="flex flex-col space-y-8 font-semibold">
          <p className="text-xl md:text-3xl font-bold md:font-semibold">
            {tempData.name} , {tempData.country}
          </p>
          <div className="relative">
            <p className="text-2xl md:text-4xl font-semibold">{tempreture}c</p>
            <p className="absolute text-xl -top-5 right-20 md:right-32">o</p>
            <p className="text-sm text-gray-400 mt-2">{weather}</p>
          </div>
        </div>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt="sunny"
          className="w-20 md:w-32 group-hover:-translate-y-20 transition-all duration-200"
        />
      </div>

      <div className="hero__card--footer">
        <div className="bg-yankeeBlue text-center text-white p-4 space-y-2 rounded-xl">
          <p className="text-sm font-medium">Humidity</p>
          <p className="text-md font-bold">{humidity}</p>
        </div>
        <div className="bg-champagnePink text-center text-black p-4 space-y-2 rounded-xl">
          <p className="text-sm font-medium">Pressure</p>
          <p className="text-md font-bold">{pressure}</p>
        </div>
        <div className="bg-powderBlue text-center text-black p-4 space-y-2 rounded-xl">
          <p className="text-sm font-medium">Visibility</p>
          <p className="text-md font-bold">{visibility}</p>
        </div>
      </div>
    </div>
  );
}

function CurrentAirQuality({ tempData, setError, airQuality }) {
  const { windSpeed, windDeg } = tempData.weekForcasting[0];

  const getWindDirection = function (degree) {
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

  /*________________________________ Convert wind degree to readable text format________________________________________*/

  return (
    <div className="hero__card bg-alabaster">
      <div className="flex items-center justify-between space-x-8">
        <div className="flex flex-col space-y-8 font-semibold">
          <p className="text-xl md:text-3xl font-bold md:font-semibold">
            Air Quality
          </p>
          <div className="relative">
            <p className="text-2xl md:text-4xl font-semibold">{windDeg}</p>

            <p className="text-sm text-gray-400 mt-2">
              {getWindDirection(windDeg)}
            </p>
          </div>
        </div>
        <img
          src="./images/windy.png"
          alt="sunny"
          className="w-20 md:w-32 group-hover:animate-pulse transition-all duration-300"
        />
      </div>

      <div className="hero__card--footer">
        <div className="bg-diamond text-center text-black p-4 space-y-2 rounded-xl">
          <p className="text-sm font-medium">Wind</p>
          <p className="text-md font-bold">{windSpeed}</p>
        </div>
        <div className="bg-keyLime text-center text-black p-4 space-y-2 rounded-xl">
          <p className="text-sm font-medium">Qality</p>
          <p className="text-md font-bold">{airQuality}</p>
        </div>
        <div className="bg-princetonOrange text-center text-black p-4 space-y-2 rounded-xl">
          <p className="text-sm font-medium">Population</p>
          <p className="text-md font-bold">{tempData.population}</p>
        </div>
      </div>
    </div>
  );
}

function Temperature({ children }) {
  return <div className="hero__container">{children}</div>;
}

function NextWeekForcast({ nextWeekTemp, onFilterResult }) {
  return (
    <section id="nextWeek" className="week">
      <header className="flex justify-between items-center">
        <h2>Next Week</h2>

        <select
          onChange={(e) => onFilterResult(Number(e.target.value))}
          className="border border-slate-300 p-2  rounded-md"
        >
          <option value={5}>Show 5 results</option>
          <option value={10}>Show 10 results</option>
          <option value={15}>Show 15 results</option>
          <option value={20}>Show 20 results</option>
        </select>
      </header>

      <div className="week_container">
        {nextWeekTemp.map((week, i) => (
          <DayForcast week={week} key={i} />
        ))}
      </div>
    </section>
  );
}

function DayForcast({ week }) {
  const fullDate = new Date(week.date);
  const day = fullDate.getDay();
  const year = fullDate.getFullYear();
  const date = fullDate.getDate();

  return (
    <div className="week__card">
      <p>{daysOfWeek[day].slice(0, 3)}</p>
      <p className="text-sm">
        {date} /{year}
      </p>
      <img
        src={`http://openweathermap.org/img/wn/${week.icon}@2x.png`}
        alt={week.weather}
      />
      <div className="relative">
        <p>{week.tempreture}</p>
        <p className="absolute text-sm -top-3 left-3">o</p>
      </div>
    </div>
  );
}

function Cities() {
  return (
    <section className="cities">
      <h2>Other cities</h2>

      <div className="cities__container">
        {cities.map((cityTemp, i) => (
          <City city={cityTemp} key={i} />
        ))}
      </div>
    </section>
  );
}

function City({ city }) {
  return (
    <div className="cities__card">
      <div className="mt-4 self-start mr-8 md:mr-0 md:self-auto">
        <p className="text-lg font-semibold md:text-2xl">{city.name}</p>
        <p className="text-sm">{city.tempDescription}</p>
      </div>
      <div className="text-center mx-auto">
        <img src="./images/sunnysmall.png" alt="illusration for sun" />

        <p className="relative mt-4">
          <span className="text-md font-semibold">{city.temp}c</span>
          <span className="text-sm absolute -top-3 right-6">o</span>
        </p>
      </div>
    </div>
  );
}
