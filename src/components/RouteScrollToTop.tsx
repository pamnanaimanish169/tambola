import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on route changes. If the URL has a hash (e.g. /#tool), scrolls
 * to that element after navigation so in-page anchors still work.
 */
export default function RouteScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      if (!id) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }
      const scrollToTarget = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      };
      requestAnimationFrame(scrollToTarget);
      const t = window.setTimeout(scrollToTarget, 0);
      return () => window.clearTimeout(t);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, key]);

  return null;
}
