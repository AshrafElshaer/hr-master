"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function CurrentTime() {
  const [currentTime, setCurrentTime] = useState(
    format(new Date(), "EEEE , MMMM dd - hh:mm a"),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "EEEE , MMMM dd - hh:mm a"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <h4 className="  text-sm font-semibold  text-secondary-foreground/80 w-fit">
      {currentTime}
    </h4>
  );
}
