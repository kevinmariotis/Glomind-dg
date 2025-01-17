/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "./IntroScreenStyles.scss";
// import { FrameAnimation } from "../frameAnimations/FrameAnimation";
import audio from "./glomindAudioIntro.mp3";
import video from "./animation.mp4";
import curve from "./curva_concava.svg";
import { useDispatch } from "react-redux";
import { setShowApp } from "../../redux/slices/AuthSlice";

const IntroScreen = ({ onFinish }) => {
  const dispatch = useDispatch();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
      dispatch(setShowApp(true));
    }, 6000);
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
    <>
      <div className={`intro-screen ${animate ? "animate" : ""}`}>
        {/* <FrameAnimation
          duration={5000}
          frames={200}
          location="GlomindLogoSecuencia"
          format="png"
        /> */}
        <video src={video} muted autoPlay />
        <img src={curve} alt="curve" />
        <audio src={audio} autoPlay />
      </div>
    </>
  );
};

export default IntroScreen;
