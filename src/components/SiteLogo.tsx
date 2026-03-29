import { Link } from "react-router-dom";
import tambolaLogoUrl from "./tambola-logo.svg?url";
import "./SiteLogo.css";

type SiteLogoProps = {
  /** Include “Tambola” wordmark beside the mark */
  showWordmark?: boolean;
  className?: string;
};

/**
 * Brand mark: housie-style 3×3 grid in a rounded ticket frame (tambola-logo.svg).
 */
export default function SiteLogo({
  showWordmark = true,
  className = "",
}: SiteLogoProps) {
  return (
    <Link
      to="/"
      className={`site-logo ${className}`.trim()}
      aria-label="Tambola — home"
    >
      <span className="site-logo__mark" aria-hidden>
        <img
          src={tambolaLogoUrl}
          alt=""
          width={40}
          height={40}
          decoding="async"
        />
      </span>
      {showWordmark ? (
        <span className="site-logo__wordmark">Tambola</span>
      ) : null}
    </Link>
  );
}
