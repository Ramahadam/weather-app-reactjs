export default function ErrorMessage({ err, onSetError }) {
  return (
    <div className="absolute left-2/4 transform  -translate-x-2/4 z-50 bg-slate-100 rounded-md max-w-md mx-auto w-96 h-32  p-4">
      <button onClick={() => onSetError("")} className="float-right">
        ❌
      </button>
      <p>Oops!! &nbsp; {err}</p>
    </div>
  );
}
