import { useEffect, useState } from "react";

export const MOBILE_QUERY = "(max-width: 768px)";

export function useMobileLayout() {
  const [mobile, setMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}

export function isMobileViewport() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(MOBILE_QUERY).matches
  );
}
