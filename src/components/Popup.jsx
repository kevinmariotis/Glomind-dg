import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/*
        Tamano puede ser sm, ls, xl
    */
function Popup({
  mostrarPopup = false,
  tamano = "lg",
  tipo = 2,
  titulo = "",
  mensaje = "",
  funcionAceptar = () => {},
  funcionCerrar = () => {},
  textoCerrar = "Cerrar",
  textoAceptar = "Aceptar",
  textoTercerBoton = "",
  funcionTercerBoton = () => {},
}) {
  const handleFuncionCerrar = () => funcionCerrar();
  const handleFuncionAceptar = () => funcionAceptar();
  const handleFuncionTercerBoton = () => funcionTercerBoton();

  return (
    <Modal
      className="modal-theme"
      show={mostrarPopup}
      size={tamano}
      onHide={handleFuncionCerrar}
      backdrop="static"
      keyboard={false}
      animation={false}
      centered
    >
      {titulo != "" && (
        <Modal.Header>
          <Modal.Title>{titulo}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: mensaje }} />
      </Modal.Body>
      <Modal.Footer>
        {(tipo == 2 || tipo == 3) && (
          <Button variant="btn theme-btn" onClick={handleFuncionAceptar}>
            {textoAceptar}
          </Button>
        )}
        {textoTercerBoton != "" && (
          <Button variant="secondary" onClick={handleFuncionTercerBoton}>
            {textoTercerBoton}
          </Button>
        )}
        {(tipo == 1 || tipo == 3) && (
          <Button variant="btn theme-btn-dark" onClick={handleFuncionCerrar}>
            {textoCerrar}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default Popup;
