import "./Button.css";

export function Button({ label, onClick }) {
  return (
    <button onClick={onClick} className="Button">
      {label}
    </button>
  );
}
