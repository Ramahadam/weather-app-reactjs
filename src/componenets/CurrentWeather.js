export default function CurrentWeather({ tempData }) {
  const { visibility, weather, icon, humidity, pressure, tempreture } =
    tempData?.weekForcasting[0];

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
