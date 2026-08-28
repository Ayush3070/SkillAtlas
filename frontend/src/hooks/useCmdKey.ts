import { useEffect, useState } from "react";

/** Tracks current keyboard modifier for command palette hint. */
export function useCmdKey() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform));
  }, []);
  return { isMac, symbol: isMac ? "⌘" : "Ctrl" };
}
