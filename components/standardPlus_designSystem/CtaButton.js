import "./CtaButton.css";
import Link from "next/link";

export default function CtaButton({
  label = "Commencer l'exploration",
  href = "/",
}) {
  return (
    <Link href={href}>
      <button className="searchCtaButton">
        {label}
        <div className="searchCtaButtonArrow">→</div>
      </button>
    </Link>
  );
}
