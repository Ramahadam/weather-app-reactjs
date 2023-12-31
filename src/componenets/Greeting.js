export default function Greeting() {
  const date = new Date();
  const option = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const curHour = date.getHours();

  const greeting =
    curHour < 12
      ? "Good Morning"
      : curHour < 18
      ? "Good afternoon"
      : "Good Evening";

  return (
    <div className="flex flex-col text-center md:text-left">
      <span className="font-bold text-sm">{greeting}</span>
      <span className="font-normal text-xs">
        {date.toLocaleString("us-EN", option)}
      </span>
    </div>
  );
}
