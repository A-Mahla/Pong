import { useState, useEffect } from "react";

//const isQuery950 = useMediaQuery('(max-width: 950px)')
//const isQuery950 = useMediaQuery('(min-width: 950px)')
// sx={ isQuery ? {
//		height: '10rem'
//	} : 
//	{
//		height: '5rem'
//	}
// }

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}

export default useMediaQuery;
