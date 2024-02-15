import { useState, useEffect} from "react";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    handleWindowSizeChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
