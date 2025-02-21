/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { setImage } from "../../redux/slices/CursorSlice";

function CustomCursor() {
  const { esMovil } = useContext(AuthContext);
  const { isImage, urlImage } = useSelector((state) => state.cursor);
  const location = useLocation();
  const dispatch = useDispatch();
  const locationsNo90 = ["/", "/signup", "/login", "/recover"];
  const partialLocationsNo90 = ["/examen/presentacion", "/curso/notas"];
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [deviceType, setDeviceType] = useState("");
  const [buttonHovered, setButtonHovered] = useState(false);
  const [isMenos90, setIsMenos90] = useState(false);

  // Check if it is a touch device
  const isTouchDevice = () => {
    try {
      document.createEvent("TouchEvent");
      setDeviceType("touch");
      return true;
    } catch (e) {
      setDeviceType("mouse");
      return false;
    }
  };

  const move = (e) => {
    const touchEvent = e.touches ? e.touches[0] : null;
    const x = !isTouchDevice() ? e.pageX : touchEvent?.pageX || 0;
    let y = !isTouchDevice() ? e.pageY - 90 : touchEvent?.pageY || 0;
    if (!isMenos90) {
      y = y + 90;
    }
    // const y = !isTouchDevice() ? e.pageY + window.scrollY : touchEvent?.pageY + window.scrollY || 0;

    setCursorX(x);
    setCursorY(y);

    // Set the cursor border's position directly
    const cursorBorder = document.getElementById("cursor-border");
    if (cursorBorder) {
      cursorBorder.style.left = `${x}px`;
      cursorBorder.style.top = `${y}px`;
    }
  };

  // Detectar si pasa sobre botones o links
  const handleMouseOver = (e) => {
    if (e.target.closest("button, a, input, textarea, select")) {
      setButtonHovered(true);
    }
  };
  const handleMouseOut = (e) => {
    // if (e.target.closest("button, a")) {
    setButtonHovered(false);
    // }
  };

  useEffect(() => {
    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);
    };
  }, [isMenos90]);

  useEffect(() => {
    const _isMenos90 =
      !locationsNo90.includes(location.pathname) &&
      !partialLocationsNo90.some((item) => location?.pathname?.includes(item));

    setIsMenos90(_isMenos90);
  }, [location]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      dispatch(
        setImage({
          isImage: false,
          urlImage: "",
        })
      );
    });
  }, []);

  return (
    <>
      {!esMovil ? (
        <div>
          <style>
            {`
        * {
            margin: 0;
            cursor: none !important;
        }

        #cursor {
            position: absolute;
            background-color: var(--Lavander);
            height: 12px;
            width: 12px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            transition: background-color 0.2s ease;
            z-index: 99999;
            border: 1px solid var(--Azul-petroleo);
        }

        #cursor-image {
            position: absolute;            
            width: 300px;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 99999;
            border-radius: 15px;
            opacity: 0.7;
        }

        #cursor-border {
            position: absolute;
            width: ${buttonHovered ? "70px" : "40px"};
            height: ${buttonHovered ? "70px" : "40px"};
            background-color: transparent;
            border: 3px solid var(--Azul-petroleo);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 99999;
            transition: all 0.2s ease-out;
        }
      `}
          </style>
          {isImage ? (
            <>
              <img
                id="cursor-image"
                style={{ left: `${cursorX}px`, top: `${cursorY}px` }}
                src={urlImage}
              ></img>
            </>
          ) : (
            <>
              <div
                id="cursor"
                style={{ left: `${cursorX}px`, top: `${cursorY}px` }}
              ></div>
              <div id="cursor-border"></div>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

export default CustomCursor;
