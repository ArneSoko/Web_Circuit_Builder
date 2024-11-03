import { useState, useEffect } from "react";

const LineDraw = ({id, term1 = 'i'+id, term2 = 'o'+id}) => {
    const elem1 = term1;
    const elem2 = term2;
    const [coords, setCoords] = useState({x1: 0, x2: 0, y1: 0, y2: 0});


    useEffect(() => {
      const updateCoords = () => {
        const element1 = document.getElementById(elem1);
        const element2 = document.getElementById(elem2);
  
        if (element1 && element2) {
          const rect1 = element1.getBoundingClientRect();
          const rect2 = element2.getBoundingClientRect();
  
          setCoords({
            x1: rect1.left + rect1.width / 2,
            y1: rect1.top + rect1.height / 2,
            x2: rect2.left + rect2.width / 2,
            y2: rect2.top + rect2.height / 2,
          });
        }
      }
      // Initial calculation
      updateCoords();

      // Recalculate on window resize or scroll to keep the line aligned
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords);
      
      return () => {
        window.removeEventListener('resize', updateCoords);
        window.removeEventListener('scroll', updateCoords);
      };
    }, [elem1, elem2]);


  return (
    <line id = {'l'+id}
    x1={coords.x1}
    y1={coords.y1}
    x2={coords.x2}
    y2={coords.y2}
    stroke="gray"
    strokeWidth="2"
    />
  );
};
export { LineDraw };