/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, ReactElement } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

// IMPORTADOS
import "./cardLogin.scss";
import LogoBlanco from "../../assets/icons/LogoBlanco";
import videoPrincipal from "../../assets/videos/video-login-reduced.mp4";
import React from "react";

interface CardLoginProps {
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

const CardLogin = ({ children }: CardLoginProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      className="containerCardLogin"
      sx={{
        "@media (max-height: 700px)": {
          height:
            location.pathname === "/login" ? "fit-content !important" : "auto",
        },
        "@media (max-height: 800px)": {
          height: location.pathname === "/sign-up" ? "fit-content" : "auto",
        },
      }}
    >
      {/*********/}
      {/* FONDO */}
      {/*********/}
      {/* <Box className="backgroundCard" /> */}
      <div className="header-video">
        <video src={videoPrincipal} autoPlay loop></video>
      </div>
      
      {/********/}
      {/* LOGO */}
      {/********/}
      <Box
        
        // sx={{ padding: "0px" }}
        // className="btnIcon"
        onClick={() => navigate("/home")}
        sx={{ cursor: "pointer", paddingTop: 5 }}
      >
        <LogoBlanco colorBlue="#ffffff" colorOrange="#ffffff" />
      </Box>

      {/*************/}
      {/* CONTENIDO */}
      {/*************/}
      <Box
        className="cardLogin"
        sx={{
          maxHeight: location.pathname === "/login" ? "672px" : "750px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CardLogin;
