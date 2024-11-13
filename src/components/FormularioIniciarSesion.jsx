import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { AuthContext } from "../AuthContext";

import SpamError from "./SpamError";
import Popup from "./Popup";
import Spinner from "./Spinner";

function FormularioIniciarSesion() {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const navigate = useNavigate();
  const { temaActual } = useContext(AuthContext);
  const [botonIniciarSesionEstado, setBotonIniciarSesionEstado] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");

  const [errorUsuario, setErrorUsuario] = useState("");
  const [errorContrasena, seterrorContrasena] = useState("");
  const [erroresCaptcha, seterroresCaptcha] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  const handleTogglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCaptchaChange = (value) => {
    // Almacena el valor del reCAPTCHA en el estado
    setCaptchaValue(value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const recordarme_guardado = sessionStorage.getItem("recordarme");
    if (recordarme_guardado) {
      setRecordarme(true);
      setUsername(recordarme_guardado);
    }
  }, []);

  const handleRecordarme = (event) => {
    const { checked } = event.target;
    setRecordarme(checked ? true : false);
  };

  const fetchData = async (event) => {
    event.preventDefault();

    setBotonIniciarSesionEstado("disabled");
    setMostrarSpinner(true);
    const formData = new FormData();
    formData.append("usuario", username);
    formData.append("contrasena", password);
    formData.append("g-recaptcha-response", "03AFcWeA5KLayA7hiZ1pGpHDkMR1WCrt_tpOaiJFfjWtnoSZNxs6obyJFc1YTRRMoIaerHwPs6AdZySXcPtPGtsebIc4FZPtJQdnYkc4tUts-jgvETX-m104zKUJGIIRX6sre5W4F3q_mHxIyLeYLzKHWAvvM_DTyxhrqSluJdAspePO6S5XP8698OsmPYo9AeXadqNux-Szt4pjO6z14N6197Xtjo8hdjBHOa0MT4lD70ZsGdrPs8PGL7VFasoMuQNK-tRxvn8GxlKNfnF8LuLbp2U0U2EsnbaNIn8eAKjxVhNEbXbZhAZystr5lRLUhPbYPYNuBMOePKVJBq7tTi29HSlewgDxLatl6IN8PwRkgQGYoiZnIMWkgxsjQ6MyQdRUSb7uPN9BXkhWdAEg4VIY83S-WPz2O-mowue_pfO-qOuWljNObcCm-yeyAgUsGkjZnVSQGEmS49OQwfl3HLCD2AWmByauzVjZFolZg49eb1F5q5BNstzFeWMht2uTo2TBXG5kAYvIGaFLVn899dXKLGaAnfUiM6JGm5i-_Fofu6U234f_GpDCgvEq-HoetQiGnd9TtJCNyiYbzQHev1wwSdweMEy3skp17YVlM5nq5rYJghdGXxJKbuyRPa4MiqdwUgDdA8Lv83Cp2QEYoV486hToWe684YHglwDK3qR-LDFzJ20FTwASn-nwyp-hoAfqFCgxYtM-4eOi0BwmoYkT5NNjOm6p5-m4ZPWhrLaQDNtgjtGt8Il70yAPitcVsBVdekQppmFBUxK2hhCYWW1XUXSRQx1xnm5djLFEoTBgUgRpkt7ByWswbSQaCrKduO9eTl_hUjEt5q7_m-JUQNU_lF_p20zpohYddHQDTUcDZsj9pAhudhROjTZ-cezdDaVnFxVtQcmGDD6H7uI9ASk7va2XjoPMKeabTVbdcEgFbPvFSzOw794jUpPB80WGc-Lw7iq0P9bgVOTL57kHg-ya52sn_oiqLd4237MeN_5NtlfCJkiGCZmb25V1jOKUL9V8iCnTuNu5R9mJKEXikBaZ-anhg6aTSsfnG3A2PNnKoTC3DowJFwcaceslOcjli_GKwsJ6Dr7KsvpLw8yrSia0Pkx_dmFG_Dcak6Lm1ydosOd82j1I11L7_82lsHYxtuYJ5FvSZxQWC4juAR5slJaV_9NXgQnI-wnRphqMptIFVtqPD5jlimcynrUWv69dtsibNyYtVIUT84ycoEmMIlSOgyoOfFR5rbGZQxx4l1Glqm35N5gmPfQntnxxMTdoKoLqALJoote7f0LFxFGYYamp5fEEbj3m5TAo5zNYUTmOOo4m2C8Fls1GwsH7YhB_A1zlGXdwjlsQTkBQxJLxloJvYxm6wAWKAOiQvoQBxwzaLTr4T8l6dexg6F4vp8Fx51zML5AZEBPNk4JMDjpdzH8emwc7KY1rzsAq48pq_kwBGjeOlGzKM5tfMIE3iB2jjmddd0Jc_a_W_Qg06qBrmRlkVmBbzLFWsf4rtzulJaqZv7DVWeDEo5Dzdc7E8BmAq4ZjYkzalk8Z2niUaHdht-BfjuUwm90kH-HN0vSKcHrbB7_umtBJvPNygxAMKWYaWrZL2mVMeu9fHtp8sk_5lPlEx1u2UnV_2kB_fRI5CSXdhQqB4RrR5XbToEQvYCYhBNEyc3vaXBADXJdvsNAWgLYLHkMj4SOTsbP4ctmxfXUDbsxmPux2BoEY2_Hr4WkuOMDXdQ2Juu7auAMfNS0pI_TKWJe-7HZwh89xCG-QqbHeHXLXYmlUovgGM-xEeLt1mGo1TTz0bdA8_GvK0AsnGcJcBxTF08QXiG3Hs-zrGiaWkDSwFEnr7r9iLpDCelhaMveVWmf230T77f5nNzwNAaAAYcG-9ymKksCqNRRxjr_3JaEGetBdhTfN9sdj5CnaCGD3t9sJv4y1TSssoMAW1Gag1Ild6y3nJHbKz7Xyx6vU7hnnAtrtIyad352Y_hIzK2PvL1RMTo5FlLtUaUIieQwt7mhPzhPA8_9W1q9guQvCIAg8AfIcZejX81DQsGS-NnwEMPjRE5OBOW-6DilxeoF5Y0eHJBB-GVkqHI9kK1ZjH8pXuvwuY21i7O7YDiXn3wVdbg_6mPvDwnYDqKcPmKzZwmRnjlVTzrYTjIjZ-Gf0zpsPHkwUlp6MsbjZhXPtCdnm1Klu-hQI5X");
    const opciones = {
      method: "POST",
      headers: {},
      body: formData,
    };

    try {
      const response = await fetch(`${urlBaseApi}/api/sesion`, opciones);
      setMostrarSpinner(false);
      const data = await response.json();
      if (response.ok) {
        // Procesar los datos en caso de éxito
        console.log("Inició sesión correctamente, datos de respuesta:", data);
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        Cookies.set("jwt", data.token, { expires: expirationDate });
        if (recordarme) {
          sessionStorage.setItem("recordarme", username);
        } else {
          if (sessionStorage.getItem("recordarme")) {
            sessionStorage.removeItem("recordarme");
          }
        }
        window.location.href = "/cursos/matriculados"; //se recarga la aplicacion de nuevo para que el AuthContext valide la cookie y cargue los permisos
        return;
      } else {
        // Obtener el código de error de la respuesta
        const statusCode = response.status;
        let errores = {};
        if (typeof data.datos !== "undefined") {
          errores = data.datos;
        }

        let erroresusuario = "";
        let errorecontrasena = "";
        let errorescapchax = "";

        Object.entries(errores).forEach(([clave, mensajes]) => {
          console.log(`Clave: ${clave}`);
          mensajes.forEach((mensaje) => {
            switch (clave) {
              case "usuario":
                if (erroresusuario != "") {
                  erroresusuario = `${erroresusuario}, ${mensaje}`;
                } else {
                  erroresusuario = `${mensaje}`;
                }
                break;
              case "contrasena":
                if (errorecontrasena != "") {
                  errorecontrasena = `${errorecontrasena}, ${mensaje}`;
                } else {
                  errorecontrasena = `${mensaje}`;
                }
                break;
              case "g-recaptcha-response":
                if (errorescapchax != "") {
                  errorescapchax = `${errorescapchax}, ${mensaje}`;
                } else {
                  errorescapchax = `${mensaje}`;
                }
                break;
            }
            console.log(`- ${mensaje}`);
          });
        });
        setErrorUsuario(erroresusuario);
        seterrorContrasena(errorecontrasena);
        seterroresCaptcha(errorescapchax);

        //si viene un codigo de error se muestra un mensaje en popup
        if (data.codigo != "") {
          if (data.codigo != "validar-email") {
            const contenidos = {
              sesioniniciada: {
                titulo: "Sesion iniciada",
                contenido: "Ya tenías la sesión iniciada previamente",
              },
              suspendido: {
                titulo: "Suspendido",
                contenido: "Su cuenta ha sido suspendida",
              },
              incorrecto: {
                titulo: "Incorrecto",
                contenido: "Nombre de usuario o contraseña incorrecta",
              },
            };
            setPopup({
              mostrar: true,
              titulo: contenidos[data.codigo].titulo,
              contenido: contenidos[data.codigo].contenido,
            });
          } else {
            navigate(
              `/usuario/validaremail/-1/${encodeURIComponent(
                data.datos.email[0]
              )}`
            );
          }
        }

        // Mostrar mensaje de error según el código de error
        switch (statusCode) {
          case 400:
            console.error("Error 400: Bad Request");
            break;
          case 401:
            console.error("Error 401: Unauthorized");
            console.log("Datos de error:", data);
            break;
          case 404:
            console.error("Error 404: Not Found");
            console.log("Datos de error:", data);
            break;
          case 500:
            console.error("Error 500: Internal Server Error");
            console.log("Datos de error:", data);
            break;
          default:
            console.error("Error desconocido");
            console.log("Datos de error:", data);
            break;
        }
        setResetKey((prevKey) => prevKey + 1);
      }
      setBotonIniciarSesionEstado("");
    } catch (error) {
      console.error("Error de conexión:", error);
      setBotonIniciarSesionEstado("");
    }
  };

  return (
    <section className="contact-area section--padding position-relative">
      {mostrarSpinner && <Spinner />}
      <Popup
        mostrarPopup={popUp.mostrar}
        tamano="xx"
        tipo={2}
        titulo={popUp.titulo}
        mensaje={popUp.contenido}
        funcionAceptar={handleFuncionAceptarPopUp}
        funcionCerrar={handleFuncionCerrarPopUp}
        textoCerrar="Aceptar"
      />
      <span className="ring-shape ring-shape-1"></span>
      <span className="ring-shape ring-shape-2"></span>
      <span className="ring-shape ring-shape-3"></span>
      <span className="ring-shape ring-shape-4"></span>
      <span className="ring-shape ring-shape-5"></span>
      <span className="ring-shape ring-shape-6"></span>
      <span className="ring-shape ring-shape-7"></span>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 mx-auto">
            <div className="card card-item card-round">
              <div className="card-body p-0">
                <h3 className="card-title text-start fs-24 lh-35 pb-2">
                  ¡Ingresa a tu cuenta!
                </h3>
                <p>Inicia tu aprendizaje con Glomind!</p>
                <form method="post" className="pt-4">
                  <div className="input-box">
                    <label className="label-text">Correo electrónico</label>
                    <div className="form-group">
                      <input
                        onChange={handleUsernameChange}
                        value={username}
                        id="username"
                        className="form-control form--control"
                        type="text"
                        name="username"
                        placeholder="Email"
                      />
                      <span className="la la-user input-icon"></span>
                      {errorUsuario != "" && (
                        <SpamError mensaje={errorUsuario} />
                      )}
                    </div>
                  </div>
                  <div className="input-box">
                    <label className="label-text">Contraseña</label>
                    <div className="input-group mb-3">
                      <span className="la la-lock input-icon"></span>
                      <input
                        onChange={handlePasswordChange}
                        value={password}
                        id="password"
                        className="form-control form--control password-field"
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Contraseña"
                      />
                      <div className="input-group-append">
                        <button
                          className={`btn theme-btn theme-btn-transparent toggle-password ${
                            passwordVisible ? "active" : ""
                          }`}
                          onClick={handleTogglePassword}
                          type="button"
                        >
                          <svg
                            className="eye-on"
                            xmlns="http://www.w3.org/2000/svg"
                            height="22px"
                            viewBox="0 0 24 24"
                            width="22px"
                            fill="#1d0959"
                          >
                            <path d="M0 0h24v24H0V0z" fill="none" />
                            <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
                          </svg>
                          <svg
                            className="eye-off"
                            xmlns="http://www.w3.org/2000/svg"
                            height="22px"
                            viewBox="0 0 24 24"
                            width="22px"
                            fill="#1d0959"
                          >
                            <path
                              d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z"
                              fill="none"
                            />
                            <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {errorContrasena != "" && (
                      <SpamError mensaje={errorContrasena} />
                    )}
                  </div>
                  <div className="btn-box">
                    <div className="d-flex align-items-center justify-content-between pb-4">
                      <div className="custom-control custom-checkbox fs-15">
                        <input
                          type="checkbox"
                          onChange={handleRecordarme}
                          checked={recordarme}
                          className="custom-control-input"
                          id="rememberMeCheckbox"
                          required
                        />
                        <label
                          className="custom-control-label custom--control-label"
                          htmlFor="rememberMeCheckbox"
                          style={{ color: "#958bb6" }}
                        >
                          Recordarme
                        </label>
                      </div>
                      <Link to={`/recover`} className="btn-text">
                        Olvidé mi contraseña
                      </Link>
                    </div>

                    <div className="input-box">
                      <div className="input-group mb-3">
                        <ReCAPTCHA
                          theme={`${temaActual == 1 ? "light" : "dark"}`}
                          key={resetKey}
                          onChange={handleCaptchaChange}
                          sitekey="6LeOBnkqAAAAAAPGh4vTCkuVsoGMuWh6EVppzYN-"
                        />
                      </div>
                      {erroresCaptcha != "" && (
                        <SpamError mensaje={erroresCaptcha} />
                      )}
                    </div>
                    <button
                      className="btn btn-round theme-btn w-100"
                      type="submit"
                      disabled={botonIniciarSesionEstado}
                      onClick={fetchData}
                    >
                      Iniciar sesión
                      <i className="la la-arrow-right icon ml-1"></i>
                    </button>
                    <p className="fs-14 pt-2 mt-2">
                      ¿No tiene una cuenta?{" "}
                      <Link
                        to="/signup"
                        className="text-color hover-underline"
                        style={{ color: "#1d0959" }}
                      >
                        Regístrese
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FormularioIniciarSesion;
