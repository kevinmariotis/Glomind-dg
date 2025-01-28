/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { AuthContext } from "../AuthContext";
import { mensajesDeError } from "./utils";
import Spinner from "./Spinner";
import SpamError from "./SpamError";
import Popup from "./Popup";
import { useSelector } from "react-redux";

function FormularioEditarCurso() {
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;
  const { id } = useParams();
  const { jwt, permissions, temaActual } = useContext(AuthContext);
  const { camposPersonalizablesCursos } = useSelector((state) => state.config);
  const [popUp, setPopup] = useState({
    mostrar: false,
    titulo: "",
    contenido: "",
  });
  const [categorias, setCategorias] = useState({});

  const [searchValueInstructor, setSearchValueInstructor] = useState("");
  const [optionsInstructor, setOptionsInstructor] = useState([]);
  const [instructorSeleccionado, setInstructorSeleccionado] = useState(null);

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nivel, setNivel] = useState("");
  const [tipoCurso, setTipoCurso] = useState("");
  const [promocionado, setPromocionado] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState({
    nombre: "Ninguna",
    id: 0,
  }); //id y nombre
  const [expedirCerfificado, setExpedirCertificado] = useState("");
  const [notaMinimaSuperado, setNotaMinimaSuperado] = useState(
    permissions[69] ? "" : "0"
  );
  const [estado, setEstado] = useState(permissions[65] ? "" : "0");
  const [precioActual, setPrecioActual] = useState(permissions[64] ? "" : "0");
  const [precioAnterior, setPrecioAnterior] = useState(
    permissions[64] ? "" : "0"
  );
  const [examenesSoloPago, setExamenesSoloPago] = useState(
    permissions[64] ? "" : "0"
  );
  const [precioAdicionalExamenes, setPrecioAdicionalExamenes] = useState(
    permissions[64] ? "" : "0"
  );
  const [certificadoSoloPago, setCertificadoSoloPago] = useState(
    permissions[64] ? "" : "0"
  );
  const [precioAdicionalCertificado, setPrecioAdicionalCertificado] = useState(
    permissions[64] ? "" : "0"
  );
  const [descripcion, setDescripcion] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagenActual, setImagenActual] = useState("");

  const [searchValueCertificado, setSearchValueCertificado] = useState("");
  const [optionsCertificado, setOptionsCertificado] = useState([]);
  const [idCertificado, setIdCertificado] = useState(null);

  const [area_de_formacion, setArea_de_formacion] = useState([]);
  const [fines_de_aprendizaje, setFines_de_aprendizaje] = useState([]);
  const [proposito_del_curso, setProposito_del_curso] = useState([]);
  const [queAprenderas, setQueAprenderas] = useState([]);
  const [requierimientos, setRequerimientos] = useState([]);
  const [otherFields, setOtherFields] = useState({});

  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    obtenerDatosServidor();
    obtenerCategorias(0);
  }, []);

  useEffect(() => {
    if (searchValueInstructor != "") {
      obtenerDatosDocentes();
    }
  }, [searchValueInstructor]);

  useEffect(() => {
    if (searchValueCertificado != "") {
      obtenerDatosCertificado();
    }
  }, [searchValueCertificado]);

  const handleNombreChange = (event) => {
    setNombre(event.target.value);
  };
  const handleCodigoChange = (event) => {
    setCodigo(event.target.value);
  };
  const handleNivelChange = (event) => {
    setNivel(event.target.value);
  };
  const handleTipoCursoChange = (event) => {
    setTipoCurso(event.target.value);
  };
  const handlePromocionadoChange = (event) => {
    setPromocionado(event.target.value);
  };
  const handleExpedirCertiticadoChange = (event) => {
    setExpedirCertificado(event.target.value);
  };
  // const handleIdCertificadoChange = (event) => {
  //   setIdCertificado(event.target.value);
  // };
  const handleNotaMinimaSuperadoChange = (event) => {
    setNotaMinimaSuperado(event.target.value);
  };
  const handleEstadoChange = (event) => {
    setEstado(event.target.value);
  };
  const handlePrecioActualChange = (event) => {
    setPrecioActual(event.target.value);
  };
  const handlePrecioAnteriorChange = (event) => {
    setPrecioAnterior(event.target.value);
  };
  const handleExamenesSoloPagoChange = (event) => {
    setExamenesSoloPago(event.target.value);
  };
  const handlePrecioAdicionalExamenesChange = (event) => {
    setPrecioAdicionalExamenes(event.target.value);
  };
  const handleCertificadoSoloPagoChange = (event) => {
    setCertificadoSoloPago(event.target.value);
  };
  const handlePrecioAdicionalCertificadoChange = (event) => {
    setPrecioAdicionalCertificado(event.target.value);
  };
  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };
  const handleOtherFields = (event) => {
    setOtherFields({
      ...otherFields,
      [event.target.name]: event.target.value,
    });
  };

  //Estados de los errores de campos
  const camposErrores = {
    nombre: [],
    codigo: [],
    nivel: [],
    promocionado: [],
    id_categoria: [],
    expedir_certificado: [],
    nota_minima_superado: [],
    certificado_solo_pago: [],
    precio_actual: [],
    precio_anterior: [],
    examenes_solo_pago: [],
    precio_adicional_examenes: [],
    precio_adicional_certificado: [],
    id_instructor: [],
    id_certificado: [],
    desc_general: [],
    desc_que_aprenderas: [],
    desc_requerimientos: [],
    imagen: [],
    estado: [],
    personalizado_tipo_curso: [],
    area_de_formacion: [],
    fines_de_aprendizaje: [],
    proposito_del_curso: [],
    desc_tiempo_certificado: [],
    desc_asinc_horas_dedicacion: [],
    desc_asinc_horas_porcentaje: [],
    desc_asinc_descripcion: [],
    desc_sinc_horas_dedicacion: [],
    desc_sinc_horas_porcentaje: [],
    desc_sinc_descripcion: [],
  };
  const [erroresCampos, setErrorCampo] = useState(camposErrores);
  const setErrorCampoGlobal = (index, newValue) => {
    if (index in erroresCampos) {
      setErrorCampo((prevState) => ({
        ...prevState,
        [index]: [...(prevState[index] || []), newValue],
      }));
    }
  };
  const reiniciarErrorCampoGlobal = () => {
    for (let propiedad in erroresCampos) {
      if (Array.isArray(erroresCampos[propiedad])) {
        erroresCampos[propiedad] = [];
      }
    }
  };

  const onDrop = (acceptedFiles) => {
    // Lógica para procesar los archivos aceptados
    setSelectedImage(acceptedFiles[0]);
  };
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
  });

  const handleInputChangeInstructor = (newValue) => {
    setSearchValueInstructor(newValue);
  };

  const handleInputChangeCertificado = (newValue) => {
    setSearchValueCertificado(newValue);
  };

  const addArea_de_formacion = (event) => {
    event.preventDefault();
    setArea_de_formacion((prevTextareas) => [...prevTextareas, ""]);
  };
  const addFines_de_aprendizaje = (event) => {
    event.preventDefault();
    setFines_de_aprendizaje((prevTextareas) => [...prevTextareas, ""]);
  };
  const addProposito_del_curso = (event) => {
    event.preventDefault();
    setProposito_del_curso((prevTextareas) => [...prevTextareas, ""]);
  };

  const addQueAprenderas = (event) => {
    event.preventDefault();
    setQueAprenderas((prevTextareas) => [...prevTextareas, ""]);
  };

  const handleArea_de_formacionChange = (event, index) => {
    const updatedTextareas = [...area_de_formacion];
    updatedTextareas[index] = event.target.value;
    setArea_de_formacion(updatedTextareas);
  };
  const handleFines_de_aprendizajeChange = (event, index) => {
    const updatedTextareas = [...fines_de_aprendizaje];
    updatedTextareas[index] = event.target.value;
    setFines_de_aprendizaje(updatedTextareas);
  };
  const handleProposito_del_cursoChange = (event, index) => {
    const updatedTextareas = [...proposito_del_curso];
    updatedTextareas[index] = event.target.value;
    setProposito_del_curso(updatedTextareas);
  };

  const handleQueAprenderasChange = (event, index) => {
    const updatedTextareas = [...queAprenderas];
    updatedTextareas[index] = event.target.value;
    setQueAprenderas(updatedTextareas);
  };

  const addRequerimiento = (event) => {
    event.preventDefault();
    setRequerimientos((prevTextareas) => [...prevTextareas, ""]);
  };
  const handleRequerimientoChange = (event, index) => {
    const updatedTextareas = [...requierimientos];
    updatedTextareas[index] = event.target.value;
    setRequerimientos(updatedTextareas);
  };

  const handleFuncionAceptarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };
  const handleFuncionCerrarPopUp = () => {
    setPopup({ ...popUp, mostrar: false });
  };

  const handleSeleccionarCategoria = (event) => {
    event.preventDefault();

    const selectedIndex = event.target.selectedIndex;
    const selectedOptionText = event.target.options[selectedIndex].text;
    setCategoriaSeleccionada({
      id: event.target.value,
      nombre:
        categoriaSeleccionada.nombre != "Ninguna"
          ? categoriaSeleccionada.nombre + " > " + selectedOptionText
          : selectedOptionText,
    });
    obtenerCategorias(event.target.value);
  };

  const handleReiniciarCategoria = (event) => {
    event.preventDefault();
    setCategoriaSeleccionada({ id: 0, nombre: "Ninguna" });
    obtenerCategorias(0);
  };
  console.log(otherFields);

  const obtenerDatosServidor = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      setMostrarSpinner(true);
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);
      setMostrarSpinner(false);
      if (response.ok) {
        const datos = await response.json();
        setNombre(datos.curso.nombre);
        setCodigo(datos.curso.codigo);
        setNivel(datos.curso.nivel);
        setTipoCurso(datos.curso.personalizado_tipo_curso);
        setPromocionado(datos.curso.promocionado);
        setExpedirCertificado(datos.curso.expedir_certificado);
        setNotaMinimaSuperado(datos.curso.nota_minima_superado);
        setEstado(datos.curso.estado);
        setPrecioActual(datos.curso.precio_actual.replace(/\D/g, ""));
        setPrecioAnterior(datos.curso.precio_anterior.replace(/\D/g, ""));
        setExamenesSoloPago(datos.curso.examenes_solo_pago);
        setPrecioAdicionalExamenes(
          datos.curso.precio_adicional_examenes.replace(/\D/g, "")
        );
        setCertificadoSoloPago(datos.curso.certificado_solo_pago);
        setPrecioAdicionalCertificado(
          datos.curso.precio_adicional_certificado.replace(/\D/g, "")
        );
        setDescripcion(datos.curso.desc_general);
        console.log("....", datos);
        setOtherFields({
          desc_tiempo_certificado: datos.curso?.desc_tiempo_certificado,
          desc_asinc_horas_dedicacion: datos.curso?.desc_asinc_horas_dedicacion,
          desc_asinc_horas_porcentaje: datos.curso?.desc_asinc_horas_porcentaje,
          desc_asinc_descripcion: datos.curso?.desc_asinc_descripcion,
          desc_sinc_horas_dedicacion: datos.curso?.desc_sinc_horas_dedicacion,
          desc_sinc_horas_porcentaje: datos.curso?.desc_sinc_horas_porcentaje,
          desc_sinc_descripcion: datos.curso?.desc_sinc_descripcion,
        });
        setImagenActual(datos.curso.imagen_pequena);
        if (datos.curso.id_instructor != 0) {
          setInstructorSeleccionado({
            value: datos.curso.id_instructor,
            label: datos.curso.instructor,
          });
          setOptionsInstructor([
            { value: datos.curso.id_instructor, label: datos.curso.instructor },
          ]);
        }
        if (datos.curso.id_certificado !== null) {
          setIdCertificado({
            value: datos.curso.id_certificado,
            label: `${datos.curso.certificado_nombre} (${datos.curso.id_certificado})`,
          });
          setOptionsCertificado([
            {
              value: datos.curso.id_certificado,
              label: `${datos.curso.certificado_nombre} (${datos.curso.id_certificado})`,
            },
          ]);
        }

        let area_de_formacionx =
          datos.curso.area_de_formacion.split("<separador>");
        area_de_formacionx.forEach(function (element) {
          setArea_de_formacion((estadoActual) => {
            if (!estadoActual.includes(element)) {
              const nuevoEstado = new Set([...estadoActual, element]);
              return Array.from(nuevoEstado);
            }
            return estadoActual; // El elemento ya existe, no se agrega
          });
        });
        let fines_de_aprendizajex =
          datos.curso.fines_de_aprendizaje.split("<separador>");
        fines_de_aprendizajex.forEach(function (element) {
          setFines_de_aprendizaje((estadoActual) => {
            if (!estadoActual.includes(element)) {
              const nuevoEstado = new Set([...estadoActual, element]);
              return Array.from(nuevoEstado);
            }
            return estadoActual; // El elemento ya existe, no se agrega
          });
        });

        let proposito_del_cursox =
          datos.curso.proposito_del_curso.split("<separador>");
        proposito_del_cursox.forEach(function (element) {
          setProposito_del_curso((estadoActual) => {
            if (!estadoActual.includes(element)) {
              const nuevoEstado = new Set([...estadoActual, element]);
              return Array.from(nuevoEstado);
            }
            return estadoActual; // El elemento ya existe, no se agrega
          });
        });
        let queaprenderasx =
          datos.curso.desc_que_aprenderas.split("<separador>");
        queaprenderasx.forEach(function (element) {
          setQueAprenderas((estadoActual) => {
            if (!estadoActual.includes(element)) {
              const nuevoEstado = new Set([...estadoActual, element]);
              return Array.from(nuevoEstado);
            }
            return estadoActual; // El elemento ya existe, no se agrega
          });
        });

        let requerimientosx =
          datos.curso.desc_requerimientos.split("<separador>");
        requerimientosx.forEach(function (element) {
          setRequerimientos((estadoActual) => {
            if (!estadoActual.includes(element)) {
              const nuevoEstado = new Set([...estadoActual, element]);
              return Array.from(nuevoEstado);
            }
            return estadoActual; // El elemento ya existe, no se agrega
          });
        });

        let arbolx = datos.arbol;
        let arbol_text = "";
        arbolx.forEach(function (element) {
          if (arbol_text != "") {
            arbol_text = arbol_text + " > ";
          }
          arbol_text = arbol_text + element.nombre;
        });
        setCategoriaSeleccionada({
          nombre: arbol_text,
          id: datos.curso.id_categoria,
        });
        obtenerCategorias(datos.curso.id_categoria);
      } else {
        const datos = await response.json();
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerCategorias = async (id_padre) => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };

      //buscamos los datos de los cursos a mostrar
      //setMostrarSpinner(true);
      const response2 = await fetch(
        `${urlBaseApi}/api/categoriasistema/getCategoriasPorPadre/${id_padre}/1`,
        opciones
      );
      //setMostrarSpinner(false);
      if (response2.ok) {
        const datos2 = await response2.json();
        setCategorias(datos2);
      } else {
        const datos2 = await response2.json();
        mensajesDeError(
          setPopup,
          response2.status,
          typeof datos2.datos !== "undefined" ? datos2.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerDatosDocentes = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response2 = await fetch(
        `${urlBaseApi}/api/curso/buscardocente/${searchValueInstructor}/1`,
        opciones
      );
      if (response2.ok) {
        const datos2 = await response2.json();
        let opciones = [];
        datos2.forEach(function (element) {
          opciones.push({
            value: element.id,
            label:
              element.nombres +
              " " +
              element.apellidos +
              " (" +
              element.identificacion +
              ")",
          });
        });
        setOptionsInstructor(opciones);
      } else {
        const datos2 = await response2.json();
        mensajesDeError(
          setPopup,
          response2.status,
          typeof datos2.datos !== "undefined" ? datos2.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const obtenerDatosCertificado = async () => {
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };
    try {
      const opciones = {
        method: "GET",
        headers: headers,
      };
      const response2 = await fetch(
        `${urlBaseApi}/api/curso/buscarcertificado/${searchValueCertificado}/1`,
        opciones
      );
      if (response2.ok) {
        const datos2 = await response2.json();
        let opciones = [];
        datos2.forEach(function (element) {
          opciones.push({
            value: element.id,
            label: element.nombre + " (" + element.id + ")",
          });
        });
        setOptionsCertificado(opciones);
      } else {
        const datos2 = await response2.json();
        mensajesDeError(
          setPopup,
          response2.status,
          typeof datos2.datos !== "undefined" ? datos2.datos : {}
        );
      }
    } catch (error) {
      // Manejar el caso de error en la solicitud
      console.error("Error en la solicitud al servidor", error);
    }
  };

  const handleActualizarCurso = async (event) => {
    event.preventDefault();
    reiniciarErrorCampoGlobal();
    let queaprenderasx = "";
    let requerimientosx = "";
    let area_de_formacionx = "";
    let fines_de_aprendizajex = "";
    let proposito_del_cursox = "";

    area_de_formacion.forEach(function (element) {
      if (element.trim() != "") {
        area_de_formacionx =
          area_de_formacionx != ""
            ? area_de_formacionx + "\n" + element.trim()
            : (area_de_formacionx = element.trim());
      }
    });

    fines_de_aprendizaje.forEach(function (element) {
      if (element.trim() != "") {
        fines_de_aprendizajex =
          fines_de_aprendizajex != ""
            ? fines_de_aprendizajex + "\n" + element.trim()
            : (fines_de_aprendizajex = element.trim());
      }
    });

    proposito_del_curso.forEach(function (element) {
      if (element.trim() != "") {
        proposito_del_cursox =
          proposito_del_cursox != ""
            ? proposito_del_cursox + "\n" + element.trim()
            : (proposito_del_cursox = element.trim());
      }
    });

    queAprenderas.forEach(function (element) {
      if (element.trim() != "") {
        queaprenderasx =
          queaprenderasx != ""
            ? queaprenderasx + "\n" + element.trim()
            : (queaprenderasx = element.trim());
      }
    });
    requierimientos.forEach(function (element) {
      if (element.trim() != "") {
        requerimientosx =
          requerimientosx != ""
            ? requerimientosx + "\n" + element.trim()
            : (requerimientosx = element.trim());
      }
    });
    const raw = {
      compartir_empresas: "0",
      nombre: nombre.toString(),
      codigo: codigo.toString(),
      nivel: nivel.toString(),
      personalizado_tipo_curso: tipoCurso.toString(),
      promocionado: promocionado.toString(),
      id_instructor:
        instructorSeleccionado != null
          ? instructorSeleccionado.value.toString()
          : "0",
      id_certificado:
        idCertificado != null ? idCertificado.value.toString() : "0",
      precio_anterior: precioAnterior.toString(),
      precio_actual: precioActual.toString(),
      id_categoria: categoriaSeleccionada.id.toString(),
      idiomas: "es",
      expedir_certificado: expedirCerfificado.toString(),
      nota_minima_superado: notaMinimaSuperado.toString(),
      desc_general: descripcion,
      examenes_solo_pago: examenesSoloPago.toString(),
      precio_adicional_examenes: precioAdicionalExamenes.toString(),
      certificado_solo_pago: certificadoSoloPago.toString(),
      precio_adicional_certificado: precioAdicionalCertificado.toString(),
      estado: estado.toString(),
      desc_que_aprenderas: queaprenderasx,
      desc_requerimientos: requerimientosx,
      area_de_formacion: area_de_formacionx,
      fines_de_aprendizaje: fines_de_aprendizajex,
      proposito_del_curso: proposito_del_cursox,
      desc_tiempo_certificado: otherFields.desc_tiempo_certificado,
      desc_asinc_horas_dedicacion: otherFields.desc_asinc_horas_dedicacion,
      desc_asinc_horas_porcentaje: otherFields.desc_asinc_horas_porcentaje,
      desc_asinc_descripcion: otherFields.desc_asinc_descripcion,
      desc_sinc_horas_dedicacion: otherFields.desc_sinc_horas_dedicacion,
      desc_sinc_horas_porcentaje: otherFields.desc_sinc_horas_porcentaje,
      desc_sinc_descripcion: otherFields.desc_sinc_descripcion,
    };

    const opciones = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(raw),
    };

    try {
      setMostrarSpinner(true);
      const response = await fetch(`${urlBaseApi}/api/curso/${id}`, opciones);
      setMostrarSpinner(false);
      const datos = await response.json();
      if (response.ok) {
        //Se sube la imagen si se tuviera una adjunta
        if (selectedImage != null) {
          setMostrarSpinner(true);
          const formData = new FormData();
          formData.append("imagen", selectedImage);
          const opciones = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            body: formData,
          };
          const response = await fetch(
            `${urlBaseApi}/api/curso/actualizarImagen/${id}`,
            opciones
          );
          const datos = await response.json();
          setMostrarSpinner(false);
          if (response.ok) {
            setPopup({
              mostrar: true,
              titulo: "Listo",
              contenido: "Curso guardado satisfactoriamente",
            });
            return;
          } else {
            mensajesDeError(
              setPopup,
              response.status,
              typeof datos.datos !== "undefined" ? datos.datos : {},
              setErrorCampoGlobal,
              {
                titulo: "Rellenar formulario",
                contenido:
                  "Por favor rellene todos los campos del formulario correctamente.",
              }
            );
          }
        } else {
          setPopup({
            mostrar: true,
            titulo: "Listo",
            contenido: "Curso guardado satisfactoriamente",
          });
        }
        return;
      } else {
        mensajesDeError(
          setPopup,
          response.status,
          typeof datos.datos !== "undefined" ? datos.datos : {},
          setErrorCampoGlobal,
          {
            titulo: "Revisar formulario",
            contenido:
              "Por favor rellene todos los campos del formulario correctamente.",
          }
        );
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  // const nivelHabilidad = ["", "Básico", "Intermedio", "Avanzado"];
  const options = [];
  for (let i = 0; i <= 5; i += 0.1) {
    const optionValue = i.toFixed(2);
    options.push(
      <option key={optionValue} value={optionValue}>
        {optionValue}
      </option>
    );
  }

  const fileList = acceptedFiles.map((file, index) => (
    <li key={`imagen-ajunta${index}`}>{file.name}</li>
  ));

  return (
    <>
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
      <div className="dashboard-content-wrap">
        <div className="container-fluid">
          <div className="dashboard-heading mb-5">
            <h3 className="fs-22 font-weight-semi-bold">
              <Link to={`/cursos`}>
                <div
                  className="icon-element icon-element-sm shadow-sm cursor-pointer ml-1 text-secondary"
                  data-toggle="tooltip"
                  data-placement="top"
                  data-title="Volver a la edición de contenidos"
                >
                  <i className="la la-angle-left"></i>
                </div>
              </Link>
              &nbsp; {nombre}
            </h3>
            <span style={{ marginLeft: "55px" }}>Configuración del curso</span>
          </div>
          <form action="#">
            <div className="card card-item">
              <div className="card-body">
                <h3 className="fs-22 font-weight-semi-bold pb-2">
                  Información básica
                </h3>
                <div className="divider">
                  <span></span>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Nombre del curso</label>
                      <input
                        onChange={handleNombreChange}
                        className="form-control form--control pl-3"
                        type="text"
                        name="nombre"
                        maxLength="128"
                        value={nombre}
                        placeholder="Ej: Curso de React Avanzado"
                      />
                      {erroresCampos["nombre"].length > 0 && (
                        <SpamError mensaje={erroresCampos["nombre"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Código único</label>
                      <input
                        onChange={handleCodigoChange}
                        className="form-control form--control pl-3"
                        type="text"
                        name="codigo"
                        maxLength="32"
                        value={codigo}
                        placeholder="Ej: 25T56-20231"
                      />
                      {erroresCampos["codigo"].length > 0 && (
                        <SpamError mensaje={erroresCampos["codigo"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Nivel</label>
                      <select
                        value={nivel}
                        onChange={handleNivelChange}
                        name="nivel"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="1">Básico</option>
                        <option value="2">Medio</option>
                        <option value="3">Avanzado</option>
                      </select>
                      {erroresCampos["nivel"].length > 0 && (
                        <SpamError mensaje={erroresCampos["nivel"]} />
                      )}
                    </div>
                  </div>
                  {Object.keys(camposPersonalizablesCursos?.tipos_curso ?? {})
                    .length > 0 && (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">Tipo de curso</label>
                        <select
                          onChange={handleTipoCursoChange}
                          name="personalizado_tipo_curso"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          {Object.keys(
                            camposPersonalizablesCursos?.tipos_curso
                          ).map((tipo, index) => (
                            <option key={`tipo${index}`} value={tipo}>
                              {
                                camposPersonalizablesCursos?.tipos_curso[tipo]
                                  ?.Etiqueta
                              }
                            </option>
                          ))}
                        </select>
                        {erroresCampos["personalizado_tipo_curso"]?.length >
                          0 && (
                          <SpamError
                            mensaje={erroresCampos["personalizado_tipo_curso"]}
                          />
                        )}
                      </div>
                    </div>
                  )}
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Promocionado?</label>
                      <select
                        value={promocionado}
                        onChange={handlePromocionadoChange}
                        name="promocionado"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="0">No</option>
                        <option value="1">Si</option>
                      </select>
                      {erroresCampos["promocionado"].length > 0 && (
                        <SpamError mensaje={erroresCampos["promocionado"]} />
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Categoría: </label>&nbsp;
                      <label className="label-text">
                        {categoriaSeleccionada.nombre}
                      </label>
                      &nbsp;
                      {categoriaSeleccionada.id != 0 && (
                        <span onClick={handleReiniciarCategoria}>
                          (Reiniciar)
                        </span>
                      )}
                      <select
                        name="id_categoria"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                        onChange={handleSeleccionarCategoria}
                      >
                        <option value="">
                          {" "}
                          -- Seleccionar sub categoría --
                        </option>
                        {Object.keys(categorias).map((key) => (
                          <option
                            key={`catop-${categorias[key].id}`}
                            value={categorias[key].id}
                          >
                            {categorias[key].nombre}
                          </option>
                        ))}
                      </select>
                      {erroresCampos["id_categoria"].length > 0 && (
                        <SpamError mensaje={erroresCampos["id_categoria"]} />
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label className="label-text">Expedir ceritificado</label>
                      <select
                        value={expedirCerfificado}
                        onChange={handleExpedirCertiticadoChange}
                        name="expedir_certificado"
                        className={`form-control ${
                          temaActual == 1 ? "" : "select-dark"
                        }`}
                      >
                        <option value=""> -- Seleccione --</option>
                        <option value="0">No</option>
                        <option value="1">Si</option>
                      </select>
                      {erroresCampos["expedir_certificado"].length > 0 && (
                        <SpamError
                          mensaje={erroresCampos["expedir_certificado"]}
                        />
                      )}
                    </div>
                  </div>
                  {permissions[69] ? (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">
                          Nota mínima para superar el curso
                        </label>
                        <select
                          value={notaMinimaSuperado}
                          onChange={handleNotaMinimaSuperadoChange}
                          name="nota_minima_superado"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          <option value="0"> -- No aplica --</option>
                          {options}
                        </select>
                        {erroresCampos["nota_minima_superado"].length > 0 && (
                          <SpamError
                            mensaje={erroresCampos["nota_minima_superado"]}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {permissions[65] ? (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">Estado</label>
                        <select
                          value={estado}
                          onChange={handleEstadoChange}
                          name="estado"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          <option value="1">
                            Disponible para nuevas compras
                          </option>
                          <option value="0">No disponible para comprar</option>
                        </select>
                        {erroresCampos["estado"].length > 0 && (
                          <SpamError mensaje={erroresCampos["estado"]} />
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {permissions[74] ? (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">Certificado</label>
                        <input type="hidden" name="id_certificado" />
                        <Select
                          name="certificado"
                          value={idCertificado}
                          onChange={(selectedOption) =>
                            setIdCertificado(selectedOption)
                          }
                          onInputChange={handleInputChangeCertificado}
                          options={optionsCertificado}
                          isClearable
                          isSearchable
                          styles={
                            temaActual == 0
                              ? {
                                  control: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#333",
                                    borderColor: "#666",
                                    color: "#fff",
                                  }),
                                  option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected
                                      ? "#444"
                                      : "#333",
                                    color: state.isSelected ? "#fff" : "#ccc",
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    color: "#fff",
                                  }),
                                  input: (provided) => ({
                                    ...provided,
                                    color: "#fff", // Asegura que el color del texto sea blanco
                                  }),
                                }
                              : {}
                          }
                        />
                        {erroresCampos["id_certificado"].length > 0 && (
                          <SpamError
                            mensaje={erroresCampos["id_certificado"]}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {permissions[64] && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">Costos</h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">
                          Precio actual (Si es gratis colocar 0)
                        </label>
                        <input
                          value={precioActual}
                          onChange={handlePrecioActualChange}
                          className="form-control form--control pl-3"
                          type="text"
                          name="precio_actual"
                          maxLength="8"
                          placeholder="Ej: 123000"
                        />
                        {erroresCampos["precio_actual"].length > 0 && (
                          <SpamError mensaje={erroresCampos["precio_actual"]} />
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">
                          Precio anterior (Si no tiene, dejar en 0)
                        </label>
                        <input
                          value={precioAnterior}
                          onChange={handlePrecioAnteriorChange}
                          className="form-control form--control tags-input"
                          type="text"
                          name="precio_anterior"
                          maxLength="8"
                          placeholder="Ej: 170000"
                        />
                        {erroresCampos["precio_anterior"].length > 0 && (
                          <SpamError
                            mensaje={erroresCampos["precio_anterior"]}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">Exámenes solo pago</label>
                        <select
                          value={examenesSoloPago}
                          onChange={handleExamenesSoloPagoChange}
                          name="examenes_solo_pago"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          <option value="0">No</option>
                          <option value="1">Si</option>
                        </select>
                        {erroresCampos["examenes_solo_pago"].length > 0 && (
                          <SpamError
                            mensaje={erroresCampos["examenes_solo_pago"]}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">
                          Precio adicional para exámenes
                        </label>
                        <input
                          value={precioAdicionalExamenes}
                          onChange={handlePrecioAdicionalExamenesChange}
                          className="form-control form--control tags-input"
                          type="text"
                          name="precio_adicional_examenes"
                          maxLength="8"
                          placeholder="Ej: 90000"
                        />
                        {erroresCampos["precio_adicional_examenes"].length >
                          0 && (
                          <SpamError
                            mensaje={erroresCampos["precio_adicional_examenes"]}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">
                          Certificado solo pago
                        </label>
                        <select
                          value={certificadoSoloPago}
                          onChange={handleCertificadoSoloPagoChange}
                          name="certificado_solo_pago"
                          className={`form-control ${
                            temaActual == 1 ? "" : "select-dark"
                          }`}
                        >
                          <option value=""> -- Seleccione --</option>
                          <option value="0">No</option>
                          <option value="1">Si</option>
                        </select>
                        {erroresCampos["certificado_solo_pago"].length > 0 && (
                          <SpamError
                            mensaje={erroresCampos["certificado_solo_pago"]}
                          />
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label className="label-text">
                          Precio adicional certificado
                        </label>
                        <input
                          value={precioAdicionalCertificado}
                          onChange={handlePrecioAdicionalCertificadoChange}
                          className="form-control form--control tags-input"
                          type="text"
                          name="precio_adicional_certificado"
                          maxLength="8"
                          placeholder="Ej: 90000"
                        />
                        {erroresCampos["precio_adicional_certificado"].length >
                          0 && (
                          <SpamError
                            mensaje={
                              erroresCampos["precio_adicional_certificado"]
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {permissions[68] ? (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Instructor
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <label className="label-text">Instructor</label>
                        <input type="hidden" name="id_instructor" />
                        <Select
                          name="instructor"
                          value={instructorSeleccionado}
                          onChange={(selectedOption) =>
                            setInstructorSeleccionado(selectedOption)
                          }
                          onInputChange={handleInputChangeInstructor}
                          options={optionsInstructor}
                          isClearable
                          isSearchable
                          styles={
                            temaActual == 0
                              ? {
                                  control: (provided) => ({
                                    ...provided,
                                    backgroundColor: "#333",
                                    borderColor: "#666",
                                    color: "#fff",
                                  }),
                                  option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected
                                      ? "#444"
                                      : "#333",
                                    color: state.isSelected ? "#fff" : "#ccc",
                                  }),
                                  singleValue: (provided) => ({
                                    ...provided,
                                    color: "#fff",
                                  }),
                                  input: (provided) => ({
                                    ...provided,
                                    color: "#fff", // Asegura que el color del texto sea blanco
                                  }),
                                }
                              : {}
                          }
                        />
                        {erroresCampos["id_instructor"].length > 0 && (
                          <SpamError mensaje={erroresCampos["id_instructor"]} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="card card-item">
              <div className="card-body">
                <h3 className="fs-22 font-weight-semi-bold pb-2">
                  Descripción
                </h3>
                <div className="divider">
                  <span></span>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="form-group">
                      <label className="label-text">
                        Descripción del curso
                      </label>
                      <textarea
                        value={descripcion}
                        onChange={handleDescripcionChange}
                        className="form-control form--control user-text-editor pl-3"
                        name="desc_general"
                      ></textarea>
                      {erroresCampos["desc_general"].length > 0 && (
                        <SpamError mensaje={erroresCampos["desc_general"]} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {camposPersonalizablesCursos?.tipos_curso[
              tipoCurso
            ]?.text_areas_mostrados?.includes("area_de_formacion") && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Área de formación
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  {erroresCampos["area_de_formacion"].length > 0 && (
                    <SpamError mensaje={erroresCampos["area_de_formacion"]} />
                  )}
                  <div className="row">
                    {area_de_formacion.map((value, index) => (
                      <div className="col-lg-12" key={index}>
                        <div className="form-group">
                          <textarea
                            key={index}
                            value={value}
                            onChange={(event) =>
                              handleArea_de_formacionChange(event, index)
                            }
                            className="form-control form--control user-text-editor pl-3"
                            name="area_de_formacion[]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn theme-btn"
                    onClick={addArea_de_formacion}
                  >
                    <i className="la la-plus mr-2"></i> Agregar otra
                  </button>
                </div>
              </div>
            )}
            {camposPersonalizablesCursos?.tipos_curso[
              tipoCurso
            ]?.text_areas_mostrados?.includes("fines_de_aprendizaje") && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Fines de aprendizaje
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  {erroresCampos["fines_de_aprendizaje"].length > 0 && (
                    <SpamError
                      mensaje={erroresCampos["fines_de_aprendizaje"]}
                    />
                  )}
                  <div className="row">
                    {fines_de_aprendizaje.map((value, index) => (
                      <div className="col-lg-12" key={index}>
                        <div className="form-group">
                          <textarea
                            key={index}
                            value={value}
                            onChange={(event) =>
                              handleFines_de_aprendizajeChange(event, index)
                            }
                            className="form-control form--control user-text-editor pl-3"
                            name="fines_de_aprendizaje[]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn theme-btn"
                    onClick={addFines_de_aprendizaje}
                  >
                    <i className="la la-plus mr-2"></i> Agregar otra
                  </button>
                </div>
              </div>
            )}
            {camposPersonalizablesCursos?.tipos_curso[
              tipoCurso
            ]?.text_areas_mostrados?.includes("proposito_del_curso") && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Proposito del curso
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  {erroresCampos["proposito_del_curso"].length > 0 && (
                    <SpamError mensaje={erroresCampos["proposito_del_curso"]} />
                  )}
                  <div className="row">
                    {proposito_del_curso.map((value, index) => (
                      <div className="col-lg-12" key={index}>
                        <div className="form-group">
                          <textarea
                            key={index}
                            value={value}
                            onChange={(event) =>
                              handleProposito_del_cursoChange(event, index)
                            }
                            className="form-control form--control user-text-editor pl-3"
                            name="proposito_del_curso[]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn theme-btn"
                    onClick={addProposito_del_curso}
                  >
                    <i className="la la-plus mr-2"></i> Agregar otra
                  </button>
                </div>
              </div>
            )}
            {camposPersonalizablesCursos?.tipos_curso[
              tipoCurso
            ]?.text_areas_mostrados?.includes("desc_que_aprenderas") && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Con este curso serás capaz de:
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  {erroresCampos["desc_que_aprenderas"].length > 0 && (
                    <SpamError mensaje={erroresCampos["desc_que_aprenderas"]} />
                  )}
                  <div className="row">
                    {queAprenderas.map((value, index) => (
                      <div className="col-lg-12" key={index}>
                        <div className="form-group">
                          <textarea
                            key={index}
                            value={value}
                            onChange={(event) =>
                              handleQueAprenderasChange(event, index)
                            }
                            className="form-control form--control user-text-editor pl-3"
                            name="desc_que_aprenderas[]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn theme-btn" onClick={addQueAprenderas}>
                    <i className="la la-plus mr-2"></i> Agregar otra
                  </button>
                </div>
              </div>
            )}
            {camposPersonalizablesCursos?.tipos_curso[
              tipoCurso
            ]?.text_areas_mostrados?.includes("desc_requerimientos") && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Dirigido a:
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  {erroresCampos["desc_requerimientos"].length > 0 && (
                    <SpamError mensaje={erroresCampos["desc_requerimientos"]} />
                  )}
                  <div className="row">
                    {requierimientos.map((value, index) => (
                      <div className="col-lg-12" key={index}>
                        <div className="form-group">
                          <textarea
                            key={index}
                            value={value}
                            onChange={(event) =>
                              handleRequerimientoChange(event, index)
                            }
                            className="form-control form--control user-text-editor pl-3"
                            name="desc_requerimientos[]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn theme-btn" onClick={addRequerimiento}>
                    <i className="la la-plus mr-2"></i> Agregar otro
                  </button>
                </div>
              </div>
            )}

            {/* Distribucion de tiempos */}
            {camposPersonalizablesCursos?.tipos_curso[
              tipoCurso
            ]?.text_areas_mostrados?.includes("desc_tiempo_certificado") && (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Tiempo de dedicación certificable
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  <div className="row">
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_tiempo_certificado"
                    ) && (
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="label-text">
                            Tiempo certificado:
                          </label>
                          <input
                            value={otherFields["desc_tiempo_certificado"]}
                            onChange={handleOtherFields}
                            className="form-control form--control tags-input"
                            type="text"
                            name="desc_tiempo_certificado"
                            maxLength="8"
                            placeholder="Horas"
                          />
                          {erroresCampos["desc_tiempo_certificado"].length >
                            0 && (
                            <SpamError
                              mensaje={erroresCampos["desc_tiempo_certificado"]}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {camposPersonalizablesCursos?.tipos_curso[
                    tipoCurso
                  ]?.text_areas_mostrados?.includes(
                    "desc_asinc_horas_dedicacion"
                  ) && (
                    <>
                      <h3 className="fs-22 font-weight-semi-bold pb-2">
                        Distribución de Horas
                      </h3>
                      <div className="divider">
                        <span></span>
                      </div>
                    </>
                  )}
                  {camposPersonalizablesCursos?.tipos_curso[
                    tipoCurso
                  ]?.text_areas_mostrados?.includes(
                    "desc_asinc_horas_dedicacion"
                  ) && (
                    <h3 className="fs-18 font-weight-semi-bold pb-2">
                      Horas Asincrónicas (Independiente)
                    </h3>
                  )}
                  <div className="row">
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_asinc_horas_dedicacion"
                    ) && (
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="label-text">
                            Horas de dedicación
                          </label>
                          <input
                            value={otherFields["desc_asinc_horas_dedicacion"]}
                            onChange={handleOtherFields}
                            className="form-control form--control tags-input"
                            type="text"
                            name="desc_asinc_horas_dedicacion"
                            maxLength="8"
                            placeholder="Horas"
                          />
                          {erroresCampos["desc_asinc_horas_dedicacion"].length >
                            0 && (
                            <SpamError
                              mensaje={
                                erroresCampos["desc_asinc_horas_dedicacion"]
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_asinc_horas_porcentaje"
                    ) && (
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="label-text">% (horas)</label>
                          <input
                            value={otherFields["desc_asinc_horas_porcentaje"]}
                            onChange={handleOtherFields}
                            className="form-control form--control tags-input"
                            type="text"
                            name="desc_asinc_horas_porcentaje"
                            maxLength="3"
                            placeholder="Porcentaje"
                          />
                          {erroresCampos["desc_asinc_horas_porcentaje"].length >
                            0 && (
                            <SpamError
                              mensaje={
                                erroresCampos["desc_asinc_horas_porcentaje"]
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_asinc_descripcion"
                    ) && (
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="label-text">Descripción</label>
                          <textarea
                            value={otherFields["desc_asinc_descripcion"]}
                            onChange={handleOtherFields}
                            className="form-control form--control user-text-editor pl-3"
                            name="desc_asinc_descripcion"
                            rows={5}
                          ></textarea>
                          {erroresCampos["desc_asinc_descripcion"].length >
                            0 && (
                            <SpamError
                              mensaje={erroresCampos["desc_asinc_descripcion"]}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {camposPersonalizablesCursos?.tipos_curso[
                    tipoCurso
                  ]?.text_areas_mostrados?.includes(
                    "desc_sinc_horas_dedicacion"
                  ) && (
                    <h3 className="fs-18 font-weight-semi-bold pb-2">
                      Horas Sincrónicas (Acompañamiento con docente)
                    </h3>
                  )}
                  <div className="row">
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_sinc_horas_dedicacion"
                    ) && (
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="label-text">
                            Horas de dedicación
                          </label>
                          <input
                            value={otherFields["desc_sinc_horas_dedicacion"]}
                            onChange={handleOtherFields}
                            className="form-control form--control tags-input"
                            type="text"
                            name="desc_sinc_horas_dedicacion"
                            maxLength="8"
                            placeholder="Horas"
                          />
                          {erroresCampos["desc_sinc_horas_dedicacion"].length >
                            0 && (
                            <SpamError
                              mensaje={
                                erroresCampos["desc_sinc_horas_dedicacion"]
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_sinc_horas_porcentaje"
                    ) && (
                      <div className="col-lg-6">
                        <div className="form-group">
                          <label className="label-text">% (horas)</label>
                          <input
                            value={otherFields["desc_sinc_horas_porcentaje"]}
                            onChange={handleOtherFields}
                            className="form-control form--control tags-input"
                            type="text"
                            name="desc_sinc_horas_porcentaje"
                            maxLength="3"
                            placeholder="Porcentaje"
                          />
                          {erroresCampos["desc_sinc_horas_porcentaje"].length >
                            0 && (
                            <SpamError
                              mensaje={
                                erroresCampos["desc_sinc_horas_porcentaje"]
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                    {camposPersonalizablesCursos?.tipos_curso[
                      tipoCurso
                    ]?.text_areas_mostrados?.includes(
                      "desc_sinc_descripcion"
                    ) && (
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label className="label-text">Descripción</label>
                          <textarea
                            value={otherFields["desc_sinc_descripcion"]}
                            onChange={handleOtherFields}
                            className="form-control form--control user-text-editor pl-3"
                            name="desc_sinc_descripcion"
                            rows={5}
                          ></textarea>
                          {erroresCampos["desc_sinc_descripcion"].length >
                            0 && (
                            <SpamError
                              mensaje={erroresCampos["desc_sinc_descripcion"]}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {permissions[66] ? (
              <div className="card card-item">
                <div className="card-body">
                  <h3 className="fs-22 font-weight-semi-bold pb-2">
                    Imágen del curso
                  </h3>
                  <div className="divider">
                    <span></span>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group mb-0">
                        <label className="label-text">Imágen del curso</label>
                        <div {...getRootProps()}>
                          {imagenActual != "" && (
                            <>
                              <img
                                className="mr-3"
                                src={`${urlBaseApi}/${imagenActual}`}
                                alt="Imagen del curso"
                              />
                              <br />
                            </>
                          )}
                          <input
                            {...getInputProps()}
                            className="multi file-upload-input"
                          />
                          <span className="file-upload-text">
                            <i className="la la-cloud-upload mr-2 fs-18"></i>
                            Seleccona o arrastra la imagen aquí.
                          </span>
                        </div>
                        <ul>{fileList}</ul>
                        {erroresCampos["imagen"].length > 0 && (
                          <SpamError mensaje={erroresCampos["imagen"]} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="course-submit-btn-box pb-4">
              <button
                className="btn theme-btn"
                type="submit"
                onClick={handleActualizarCurso}
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FormularioEditarCurso;
