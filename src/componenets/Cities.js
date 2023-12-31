import City from "./City";
const cities = [
  { name: "Sharjah", temp: 33, tempDescription: "Sunny day" },
  { name: "Ajman", temp: 33, tempDescription: "Sunny day" },
  { name: "Abu Dhabi", temp: 33, tempDescription: "Sunny day" },
];

export default function Cities() {
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
