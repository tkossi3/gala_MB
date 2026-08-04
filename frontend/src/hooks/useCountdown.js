import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

export function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      setRemaining({
        days: pad(Math.floor(diff / (1000 * 60 * 60 * 24))),
        hours: pad(Math.floor((diff / (1000 * 60 * 60)) % 24)),
        minutes: pad(Math.floor((diff / (1000 * 60)) % 60)),
        seconds: pad(Math.floor((diff / 1000) % 60))
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return remaining;
}
