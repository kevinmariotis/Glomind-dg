import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactPlayer from "react-player";

// eslint-disable-next-line react/prop-types
const ModalVideoCurso = ({ curso = {}, video }) => {
  const [show, setShow] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;

  console.log(curso.video_grande);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowControls = () => {
    setShowControls(true);
  };
  const handleHideControls = () => {
    setShowControls(false);
  };

  return (
    <>
      <button
        className="btn theme-btn btn-round d-flex align-items-center w-100"
        onClick={handleShow}
        style={{
          fontSize: "12px"
        }}
      >
        <i className="la la-play icon mr-2"></i>
        Video
      </button>

      <Modal className="custom-modal" show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Modal.Title>{curso.nombre}</Modal.Title>
          <div
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "var(--CornerMedium)",
              overflow: "hidden",
              margin: "30px 0",
            }}
            onMouseMove={handleShowControls}
          >
            <ReactPlayer
              url={`${urlBaseApi}/${video}`}
              controls={showControls}
              width="100%"
              height="100%"
              style={{ marginBottom: "-10px" }}
              onPlay={handleHideControls}
              config={{
                file: {
                  attributes: {
                    onContextMenu: (e) => e.preventDefault(),
                    controlsList: "nodownload",
                  },
                },
              }}
            />
          </div>
          <Button variant="secondary btn-round" onClick={handleClose}>
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalVideoCurso;
