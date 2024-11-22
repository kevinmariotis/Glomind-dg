import React, { useState } from "react";
import CustomBreandcrumb from "../../components/BreadCrumb/CustomBreandcrumb";

const FomularioCalificaciones = () => {
  const [asignatura, setAsignatura] = useState<any>(null);

  const verCalificaciones = () => {
    setAsignatura(0);
  };

  const volver = () => {
    setAsignatura(null);
  };

  return (
    <div className="dashboard-content-wrap">
      {asignatura !== null && (
        <button onClick={volver} className="btn theme-btn btn-round  mb-5">
          <i className="la la-arrow-left icon ml-1"></i> Atrás
        </button>
      )}
      <CustomBreandcrumb
        titles={[
          asignatura === null ? "Calificaciones" : "Nombre de asignatura",
        ]}
      />
      {asignatura !== null && (
        <p  className="mx-2">Codigo</p>
      )}
      {asignatura === null ? (
        <>
          <div className="d-flex mt-5">
            <button className="btn theme-btn-white btn-round py 3 mr-3">
              <i className="la la-filter icon mr-1"></i>
              Categoria
            </button>
            <button className="btn theme-btn-white btn-round py 3">
              <i className="la la-filter icon mr-1"></i>
              Semestre
            </button>
          </div>
          <div className="card custom-card mt-4">
            <div className="table-responsive mb-5">
              <table className="table custom-table">
                <thead>
                  <tr>
                    <th scope="col">Nombre del asignatura</th>
                    <th scope="col">Categoria</th>
                    <th scope="col">Nombre de la asignatura/curso</th>
                    <th scope="col">Semestre</th>
                    <th scope="col">Codigo</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>vuvndn</td>
                    <td>vuvndn</td>
                    <td>vuvndn</td>
                    <td>vuvndn</td>
                    <td>vuvndn</td>
                    <td>
                      <button
                        className="btn theme-btn btn-round w-100 px-0"
                        onClick={() => verCalificaciones()}
                      >
                        Ver calificaciones
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* <Paginador
            elemetosTotales={totalCertificados}
            elementosPorPagina={15}
            paginaActual={paginaNavegacion}
            callbackCambioPagina={setPaginaNavegacion}
          /> */}
            </div>
          </div>
        </>
      ) : (
        <div className="card custom-card mt-4">
          <div className="table-responsive mb-5">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th scope="col">Nombre de la actividad</th>
                  <th scope="col">Porcentaje del curso</th>
                  <th scope="col">Calificación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>vuvndn</td>
                  <td>vuvndn</td>
                  <td>vuvndn</td>
                </tr>
              </tbody>
            </table>
            {/* <Paginador
            elemetosTotales={totalCertificados}
            elementosPorPagina={15}
            paginaActual={paginaNavegacion}
            callbackCambioPagina={setPaginaNavegacion}
          /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FomularioCalificaciones;
