import "./CtaButton.css";

export default function CtaButton({
  label = "Commencer l'exploration",
}) {
  return (
    <button type="button" className="searchCtaButton">
      {label}
      <div className="searchCtaButtonArrow">→</div>
    </button>
  );
}
