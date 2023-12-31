import { useEffect, useState } from "react";
import useFetchBrowserLocation from "./useFetchBrowserLocation";
import Navbar from "./componenets/Navbar";
import Cities from "./componenets/Cities";
import CurrentAirQuality from "./componenets/CurrentAirQuality";
import Logo from "./componenets/Logo";
import ErrorMessage from "./componenets/ErrorMessage";
import Search from "./componenets/Search";
import Greeting from "./componenets/Greeting";
import Loader from "./componenets/Loader";
import CurrentWeather from "./componenets/CurrentWeather";
import Temperature from "./componenets/Temperature";
import NextWeekForcast from "./componenets/NextWeekForcast";

const apiKey = "c4527f71d691e7e12d76b81a49767c52";

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

export default function App() {
  const [tempData, setTempData] = useState({});
  const [airQuality, setAirQuality] = useState("");
  const [nextWeekTemp, setNextWeekTemp] = useState(tempNextWeekTemp);
  const [filterResult, setFilterResult] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  function handleTempData({ city, list }) {
    setIsLoading(true);

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
    setIsLoading(false);

    //Set localstorage:
    localStorage.setItem("city", query);
  }

  function handleFilterResult(value) {
    setFilterResult((val) => value);
  }

  //Fetching browser location using Custom hooks

  const [error, query, setError, setQuery] = useFetchBrowserLocation(
    `http://api.openweathermap.org/geo/1.0/reverse`,
    apiKey
  );

  //Fetching weather data
  useEffect(
    function () {
      setIsLoading(true);
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
    [query, filterResult] //TODO you can optimize the filtring process it should not be dependent on useEffect for best practise
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
        <Search onSetQuery={setQuery} handleFilterResult={handleFilterResult} />
        <Greeting />
      </Navbar>

      {error && <ErrorMessage err={error} onSetError={setError} />}
      {isLoading ? (
        <Loader />
      ) : (
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
