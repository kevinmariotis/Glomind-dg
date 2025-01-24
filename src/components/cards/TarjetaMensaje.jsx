/* eslint-disable react/prop-types */

const TarjetaMensaje = ({
  mensaje = `Para desarrollar este compromisos académico debes descargar el recurso
        (Documento o guía ) que aparece en la sección del contenido
        correspondiente.`,
  version = 1,
}) => {
  return (
    <div
      className={`${
        version === 1 ? "card-message" : "card-message-white"
      } animate__animated animate__pulse animate__infinite`}
    >
      <span>{mensaje}</span>
    </div>
  );
};

export default TarjetaMensaje;
