
import { React, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../authentication/authentication.css";

const CarAnimation = () => {
  const carRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const car = carRef.current;

    const enterDuration = 2000;
    const pauseDuration = 750;
    const exitDuration = 2000;

    let startTime = null;
    let phase = "enter";

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const screenWidth = window.innerWidth;
      const carWidth = car.offsetWidth;

      const startX = screenWidth;
      const centerX = screenWidth / 2 - carWidth / 2;
      const endX = -carWidth - 80;

      if (phase === "enter") {
        const progress = Math.min(elapsed / enterDuration, 1);
        const x = startX + (centerX - startX) * progress;
        car.style.transform = `translateX(${x}px)`;

        if (progress >= 1) {
          phase = "pause";
          startTime = timestamp;
        }
      } else if (phase === "pause") {
        car.style.transform = `translateX(${centerX}px)`;

        if (elapsed >= pauseDuration) {
          phase = "exit";
          startTime = timestamp;
        }
      } else if (phase === "exit") {
        const progress = Math.min(elapsed / exitDuration, 1);
        const x = centerX + (endX - centerX) * progress;
        car.style.transform = `translateX(${x}px)`;

        if (progress >= 1) {
          navigate("/login"); // rruga e Login.js
          return;
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [navigate]);

  return (
    <div className="bodyAuth">
    <div className="highway">
      <div className="car" ref={carRef}>
        <img
          src="https://i.postimg.cc/2SVfHC8d/car.png"
          alt="car"
        />
        <div className="wheels">
          <div className="wheel front-wheel"></div>
          <div className="wheel back-wheel"></div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CarAnimation;
// import { Link } from "react-router-dom";
// import { useAuth } from "../../../components/context/AuthContext" 
// 
// const Authentication = () => {
    // const {isAuthenticated, user, logout} = useAuth();
// 
    // return (
        // <nav>
            {/* {!isAuthenticated ? ( */}
                // <>
                {/* <Link to="/login">Login</Link><br/> */}
                {/* <Link to="/signup">Signup</Link> */}
                {/* </> */}
            // ) : (
                // <>
                {/* <Link to="/Home"></Link> */}
                {/*  */}
                {/*  */}
                {/* </> */}
            // )}
{/*  */}
        {/* </nav> */}
    // )
// }
// export default Authentication;


