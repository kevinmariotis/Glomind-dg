import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ReactPlayer from "react-player";
import video from "../../assets/videos/video-login-reduced.mp4";

// eslint-disable-next-line react/prop-types
const ModalVideoCurso = ({ curso = {}, video }) => {
  const [show, setShow] = useState(false);
  const urlBaseApi = import.meta.env.VITE_URL_BASE_API;

  console.log(curso.video_grande)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        className="btn theme-btn btn-round py 3"
        style={{ width: "70px !important", marginLeft: "10px" }}
        onClick={handleShow}
      >
        <i className="la la-play icon"></i>
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
          >
            <ReactPlayer
              url={`${urlBaseApi}/${video}`}
              controls
              width="100%"
              height="100%"
              style={{ marginBottom: "-10px" }}
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
