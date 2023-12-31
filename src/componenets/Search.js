export default function Search({ onSetQuery, handleFilterResult }) {
  function handelFrom(e) {
    e.preventDefault();

    e.target.value
      ? onSetQuery((val) => e.target.value)
      : onSetQuery(localStorage.getItem("city"));

    handleFilterResult(5);
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
