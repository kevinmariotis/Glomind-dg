import { useContext, useEffect, useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";
import SpamError from "../../components/SpamError";
import { AuthContext } from "../../AuthContext";
import { mensajesDeError } from "../../components/utils";
import Popup from "../../components/Popup";
import Spinner from "../../components/Spinner";

const FormularioPeriodos = () => {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { jwt } = useContext(AuthContext);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [popupConfirmar, setPopupConfirmar] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });

  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [listaPeriodos, setListaPeriodos] = useState([]);
  const [camposPeriodo, setCamposPeriodos] = useState({ edit: false });
  const [erroresCampos, setErroresCampos] = useState({
    nombre: [],
  });

  const setErrorCampoGlobal = (index, newValue) => {
    console.log(index, newValue);
    if (index in erroresCampos) {
      setErroresCampos((prevState) => ({
        ...prevState,
        [index]: [...(prevState[index] || []), newValue],
      }));
    }
  };

  const obtenerValorInput = (e) => {
    setCamposPeriodos({
      ...camposPeriodo,
      [e.target.name]: e.target.value,
    });
  };

  const editarPeriodo = (idPeriodo) => {
    const itemEdit = listaPeriodos.find((item) => item.id === idPeriodo);
    setCamposPeriodos({
      edit: true,
      ...itemEdit,
    });
  };

  const obtenerListaPeriodos = async () => {
    const opciones = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/periodo/getTodos`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setListaPeriodos(datos);
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          false,
          { titulo: "", contenido: "" }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const guardarPeriodos = async (e) => {
    e.preventDefault();
    const { edit, id, ...copyCampos } = camposPeriodo;
    const body = new FormData();
    if (!edit) {
      Object.keys(copyCampos)?.forEach((key) => {
        body.append(key, camposPeriodo[key]);
      });
    }

    const opciones = {
      method: edit ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: edit ? JSON.stringify(copyCampos) : body,
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(
        `${urlBaseApi}/api/periodo${edit ? `/${id}` : ""}`,
        opciones
      );
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Periodo guardado correctamente.",
        });
        setCamposPeriodos({ edit: false });
        obtenerListaPeriodos();
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          false,
          { titulo: "", contenido: "" }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const eliminarPeriodos = async (id) => {
    const opciones = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(`${urlBaseApi}/api/periodo/${id}`, opciones);
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        setPopup({
          mostrar: true,
          titulo: "Listo",
          contenido: "Periodo eliminado correctamente.",
        });
        setCamposPeriodos({ edit: false });
        obtenerListaPeriodos();
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          false,
          { titulo: "", contenido: "" }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleFuncionConfirmar = () => {
    eliminarPeriodos(popupConfirmar.id);
    setPopupConfirmar({ ...popupConfirmar, mostrar: false });
  };

  const handleFuncionCancelar = () => {
    setPopupConfirmar({ ...popupConfirmar, mostrar: false });
  };

  const handleEliminarPeriodo = (id) => {
    setPopupConfirmar({
      mostrar: true,
      titulo: "Confirmar",
      contenido: "Confirma que desea borrar este periodo?",
      id,
    });
  };

  useEffect(() => {
    obtenerListaPeriodos();
  }, []);

  return (
    <div className="dashboard-content-wrap">
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
      <Popup
        mostrarPopup={popupConfirmar.mostrar}
        tamano="xx"
        tipo={3}
        titulo={popupConfirmar.titulo}
        mensaje={popupConfirmar.contenido}
        funcionAceptar={handleFuncionConfirmar}
        funcionCerrar={handleFuncionCancelar}
        textoCerrar="Cancelar"
      />
      <CustomBreandcrumb titles={["Periodos académicos"]} />
      {/* Fomulario de periodos */}
      <div className="row mt-5">
        <div className="col-lg-4">
          <div className="card-theme">
            <div className="card-body">
              <h5>
                {camposPeriodo.edit ? "Editar" : "Crear"} periodo académico
              </h5>
              <div className="divider">
                <span></span>
              </div>
              <form onSubmit={guardarPeriodos}>
                <div className="col-lg-12">
                  <div className="form-group">
                    <label className="label-text">Nombre</label>
                    <input
                      value={camposPeriodo.nombre ?? ""}
                      onChange={obtenerValorInput}
                      className="form-control form--control pl-3"
                      type="text"
                      name="nombre"
                      maxLength="8"
                      placeholder={`Ej: ${new Date().getFullYear()}-1`}
                    />
                    {erroresCampos["nombre"].length > 0 && (
                      <SpamError mensaje={erroresCampos["nombre"]} />
                    )}
                  </div>
                </div>
                <div className="col-lg-12 text-right">
                  <button
                    className="btn theme-btn theme-btn-sm btn-round mr-2"
                    type="submit"
                  >
                    Guardar
                  </button>
                  {camposPeriodo.edit && (
                    <button
                      className="btn theme-btn-dark theme-btn-sm btn-round"
                      onClick={() => setCamposPeriodos({ edit: false })}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* Lista de periodos */}
        <div className="col-lg-8">
          <div className="card-theme">
            <div className="card-body">
              <h5>Lista de periodos académicos</h5>
              <div className="divider">
                <span></span>
              </div>
              <div className="table-responsive">
                <table className="table generic-table">
                  <thead>
                    <tr>
                      <th scope="col">Nombre</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaPeriodos.length > 0 ? (
                      listaPeriodos.map((item, index) => (
                        <tr key={`descargable-x-${index}`}>
                          <td scope="row">{item.nombre}</td>
                          <td scope="row">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                onClick={() => editarPeriodo(item.id)}
                                // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                                data-toggle="tooltip"
                                data-placement="top"
                                data-title="Editar configuración"
                                title="Editar configuración"
                                style={{
                                  color: "var(--Lavander)",
                                  fontSize: "30px",
                                }}
                              >
                                <i className="la la-pen"></i>
                              </div>
                              <div
                                onClick={() => {
                                  handleEliminarPeriodo(item.id);
                                }}
                                // className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-danger"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Borrar"
                                style={{
                                  color: "var(--Lavander)",
                                  fontSize: "30px",
                                }}
                              >
                                <span
                                  data-toggle="modal"
                                  data-target="#itemDeleteModal"
                                  className="w-100 h-100 d-inline-block"
                                >
                                  <i className="la la-trash"></i>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No se encontraron registros</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioPeriodos;
