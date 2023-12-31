import { useEffect, useState } from "react";

export default function useFetchBrowserLocation(url, apiKey) {
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(
    function () {
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
            `${url}?lat=${postion.coords.latitude}&lon=${postion.coords.longitude}&appid=${apiKey}`
          );
          const data = await res.json();
          const { name } = data[0];
          setQuery(name);
        } catch (err) {
          setError(err.message);
        }
      }

      getCurrentLocation();
    },
    [url, apiKey]
  );

  return [error, query, setError, setQuery];
}
