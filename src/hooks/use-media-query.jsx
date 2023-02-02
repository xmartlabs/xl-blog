import React, { useState, useEffect} from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  const handleWindowSizeChange = () => {
    if (window !== undefined) {
      const match = window.matchMedia(query);
      setMatches(match.matches);
    }
  };

  useEffect(() => {
    handleWindowSizeChange();
  }, [query]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  return matches;
};

export { useMediaQuery };
