import { useCallback, useEffect, useState } from "react";
import "./FrameAnimation.scss";
import React from "react";

interface FrameAnimationProps {
  location?: string;
  duration?: number;
  frames?: number;
  format?: string;
  hoverAnimation?: boolean;
  loop: boolean;
}

export const FrameAnimation = ({
  duration = 1000,
  frames = 100,
  location = "",
  format = "webp",
  hoverAnimation = false,
  loop = false,
}: FrameAnimationProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [frame, setFrame] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(!hoverAnimation);

  const animation = useCallback(() => {
    const loadedImages = Array.from(
      { length: frames },
      (_, index) =>
        `/src/assets/Animations/${location}/glomind${
          index < 10 ? `00${index}` : index < 100 ? `0${index}` : index
        }.${format}`
    );
    setImages(loadedImages);
  }, [frames, location, format]);

  const handleMouseEnter = () => {
    if (hoverAnimation) {
      setDirection(1);
      setFrame(0);
      setIsAnimating(true);
    }
  };

  const handleMouseLeave = () => {
    if (hoverAnimation) {
      setDirection(-1);
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (!isAnimating) return;
    const time = duration / frames;
    const interval = setInterval(() => {
      setFrame((prevFrame) => {
        const nextFrame = prevFrame + direction;
        if (hoverAnimation) {
          if (nextFrame >= frames - 1 || nextFrame <= 0) {
            setIsAnimating(false);
            return direction === 1 ? frames - 1 : 0;
          }
        }
        if (!loop) {
          if (nextFrame + 1 === frames) {
            setIsAnimating(false);
          }
        }
        return (nextFrame + frames) % frames;
      });
    }, time);

    return () => clearInterval(interval);
  }, [isAnimating, direction, duration, frames, hoverAnimation]);

  useEffect(() => {
    animation();
  }, [animation]);

  useEffect(() => {
    if (!hoverAnimation) {
      setIsAnimating(true);
    }
  }, [hoverAnimation]);

  return (
    <div
      className="frameAnimationContainer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((src: string, index: number) => (
        <img
          key={index}
          src={src}
          alt={`Frame${index}`}
          className="frameAnimation"
          style={{ display: index === frame ? "block" : "none" }}
        />
      ))}
    </div>
  );
};
