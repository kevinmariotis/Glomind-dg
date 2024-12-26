/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./IntroScreenStyles.scss";

const IntroScreen = ({ logo, onFinish }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  useEffect(() => {
    if (animate === true) {
      const timer = setTimeout(() => {
        if (onFinish) onFinish(); // Llama a una función cuando termina la animación
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className={`intro-screen ${animate ? "animate" : ""}`}>
      <img src={logo} alt="Logo" className="logo" />
    </div>
  );
};

export default IntroScreen;
