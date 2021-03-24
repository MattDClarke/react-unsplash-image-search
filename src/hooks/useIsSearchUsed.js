// custom hook used to prevent useEffect from running onMount (prevents first time run on page load) and to determine when search used for the first time - so that 'No images match your search' will not show until search button clicked
import { useRef, useEffect } from "react";
import useFirstRun from "./useFirstRun";

export default function useFirstSearch(query) {
  const isFirstRun = useFirstRun();
  const isSearchUsed = useRef(false);

  useEffect(() => {
    if (isFirstRun) return;
    if (isSearchUsed.current) return;
    if (isSearchUsed.current === false && query.length !== 0) {
      isSearchUsed.current = true;
    }
  }, [query, isFirstRun]);

  return isSearchUsed.current;
}