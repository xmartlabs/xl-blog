import React, { useState, useEffect} from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    handleWindowSizeChange();
  }, [query]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const handleWindowSizeChange = () => {
    if (window) {
      const match = window.matchMedia(query);
      setMatches(match.matches);
    }
  };
  return matches;
};

export { useMediaQuery };
