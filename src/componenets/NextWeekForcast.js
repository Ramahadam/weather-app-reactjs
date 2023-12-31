const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const filterResults = [5, 10, 15, 20];

export default function NextWeekForcast({ nextWeekTemp, onFilterResult }) {
  return (
    <section id="nextWeek" className="week">
      <header className="flex justify-between items-center">
        <h2>Next Week</h2>

        <select
          onChange={(e) => onFilterResult(Number(e.target.value))}
          className="border border-slate-300 p-2  rounded-md"
        >
          {filterResults.map((result, i) => (
            <option value={result} key={i}>
              Show {result} results
            </option>
          ))}
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
