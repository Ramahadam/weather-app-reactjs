export default function CurrentAirQuality({ tempData, setError, airQuality }) {
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
