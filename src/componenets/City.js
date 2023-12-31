export default function City({ city }) {
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
