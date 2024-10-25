import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";

// IMPORTADOS
import "./login.scss";
import CardLogin from "../cardLogin/CardLogin";
import IconEyeOpen from "../../assets/icons/IconEyeOpen";
import IconEyeClose from "../../assets/icons/IconEyeClose";
import React from "react";

const Login = () => {
  // OCULTAR CONTRASEÑA
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <CardLogin>
      <Box className="contentLogin">
        {/**************/}
        {/* PRE-TITULO */}
        {/**************/}
        <Typography component={"h3"} className="size20">
          Acceso al campus
        </Typography>

        {/**********/}
        {/* TITULO */}
        {/**********/}
        <Box>
          <Typography component={"h1"} className="size50">
            Iniciar Sesión
          </Typography>

          <Typography component={"h4"} className="size16">
            Aprende y amplía tu conocimiento con nosotros.
          </Typography>
        </Box>

        {/**************/}
        {/* FORMULARIO */}
        {/**************/}
        <FormControl className="formLogin">
          {/********************/}
          {/* USUARIO / CORREO */}
          {/********************/}
          <Typography component={"h4"} className="size16">
            Usuario o correo electrónico
          </Typography>
          <OutlinedInput placeholder="Usuario o correo electrónico" />

          {/**************/}
          {/* CONTRASEÑA */}
          {/**************/}
          <Typography component={"h4"} className="size16">
            Contraseña
          </Typography>
          <OutlinedInput
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  disableTouchRipple
                >
                  {showPassword ? <IconEyeOpen /> : <IconEyeClose />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* OLVIDE CONTRASEÑA */}
          <Typography component={"a"} href="#" className="size13">
            Olvidé mi contraseña
          </Typography>
        </FormControl>

        {/*********/}
        {/* BOTON */}
        {/*********/}
        <Button className="btnGradientOrangeSquare">Iniciar sesión</Button>

        {/******************/}
        {/* LINK REGISTRAR */}
        {/******************/}
        <Typography component={"h4"} className="size16">
          ¿No tienes una cuenta?{" "}
          <Typography component={"a"} href="/sign-up" className="size16">
            Regístrate
          </Typography>
        </Typography>
      </Box>
    </CardLogin>
  );
};

export default Login;
