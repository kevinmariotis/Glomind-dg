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
import CardLogin from "../../components/cardLogin/CardLogin";
import IconEyeOpen from "../../assets/icons/IconEyeOpen";
import IconEyeClose from "../../assets/icons/IconEyeClose";

const SignUp = () => {
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
          Uneté a UVirtual
        </Typography>

        {/**********/}
        {/* TITULO */}
        {/**********/}
        <Box>
          <Typography component={"h1"} className="size50">
            Registrarse
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
            Nombre completo
          </Typography>
          <OutlinedInput placeholder="Nombre completo" />

          {/**************/}
          {/* CONTRASEÑA */}
          {/**************/}
          <Typography component={"h4"} className="size16">
            Correo electrónico
          </Typography>
          <OutlinedInput placeholder="Correo electrónico" />

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
        </FormControl>

        {/*********/}
        {/* BOTON */}
        {/*********/}
        <Button className="btnGradientOrangeSquare">Crear cuenta</Button>

        {/******************/}
        {/* LINK REGISTRAR */}
        {/******************/}
        <Typography component={"h4"} className="size16">
          ¿Ya formas parte de UVirtual?{" "}
          <Typography component={"a"} href="/login" className="size16">
            Iniciar sesión
          </Typography>
        </Typography>
      </Box>
    </CardLogin>
  );
};

export default SignUp;
