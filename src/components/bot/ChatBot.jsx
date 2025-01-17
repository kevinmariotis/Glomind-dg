import "./chatBot.scss";
import { useContext, useState } from "react";
import Gloria1 from "./images/Gloria1.svg";
import Gloria2 from "./images/Gloria2.svg";
import { AuthContext } from "../../AuthContext";

const ChatBot = () => {
  const { nombres } = useContext(AuthContext);
  const [toggleChat, setToggleChat] = useState(false);
  const [view, setView] = useState(1);

  const toggleClickIconChat = () => {
    setToggleChat(!toggleChat);
    setView(1);
  };

  return (
    <>
      <div className={`chat-screen ${toggleChat ? "show-chat" : ""}`}>
        {view === 2 && (
          <div className="chat-header">
            <div className="chat-header-title">Let’s chat? - We are online</div>
            <div className="chat-header-option hide">
              <span className="dropdown custom-dropdown">
                <a
                  className="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink1"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-more-horizontal"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="dropdownMenuLink1"
                  style={{ "will-change": "transform" }}
                >
                  <a className="dropdown-item" href="javascript:void(0);">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bc32ef"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-file-text"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Send Transcriptions
                  </a>
                  <a
                    className="dropdown-item end-chat"
                    href="javascript:void(0);"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#bc32ef"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-power"
                    >
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                      <line x1="12" y1="2" x2="12" y2="12"></line>
                    </svg>
                    End Chat
                  </a>
                </div>
              </span>
            </div>
          </div>
        )}
        {view === 1 && (
          <div
            className="chat-mail"
            style={{
              background: "var(--Lavander-200)",
              borderRadius: "20px",
            }}
          >
            <div className="row">
              <div className="col-md-12 text-center">
                <img
                  src={Gloria2}
                  alt=""
                  style={{ width: "200px", marginBottom: "20px" }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center mb-4">
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  ¡Hola {nombres.split(" ")[0]}! Bienvenido, Soy Gloria, tu
                  asistente virtual.
                </p>
                <p>Estoy aquí para ayudarte!</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center mb-2">
                <button style={{ borderRadius: "15px", color: "white", background: "var(--Lavander)", width: "100%" }}>Continuar</button>
              </div>
            </div>
          </div>
        )}
        {view === 2 && (
          <div className="chat-body">
            <div className="chat-start">Monday, 1:27 PM</div>
            <div className="chat-bubble you">
              Welcome to our site, if you need help simply reply to this
              message, we are online and ready to help.
            </div>
            <div className="chat-bubble me">Hi, I am back</div>
            <div className="chat-bubble me">I just want my Report Status.</div>
            <div className="chat-bubble me">
              As i am not getting any weekly reports nowadays.
            </div>
            <div className="chat-bubble you">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{
                  margin: "auto",
                  display: "block",
                  shapeRendering: "auto",
                  width: "43px",
                  height: "20px",
                }}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
              >
                <circle cx="0" cy="44.1678" r="15" fill="#ffffff">
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.6s"
                  ></animate>
                </circle>{" "}
                <circle cx="45" cy="43.0965" r="15" fill="#ffffff">
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.39999999999999997s"
                  ></animate>
                </circle>{" "}
                <circle cx="90" cy="52.0442" r="15" fill="#ffffff">
                  <animate
                    attributeName="cy"
                    calcMode="spline"
                    keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
                    repeatCount="indefinite"
                    values="57.5;42.5;57.5;57.5"
                    keyTimes="0;0.3;0.6;1"
                    dur="1s"
                    begin="-0.19999999999999998s"
                  ></animate>
                </circle>
              </svg>
            </div>
          </div>
        )}
        {view === 2 && (
          <div className="chat-input">
            <input type="text" placeholder="Type a message..." />
            <div className="input-action-icon">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-paperclip"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-send"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
            </div>
          </div>
        )}
        {view === 3 && (
          <div className="chat-session-end">
            <h5>This chat session has ended</h5>
            <p>
              Thank you for chatting with us, If you can take a minute and rate
              this chat:
            </p>
            <div className="rate-me">
              <div className="rate-bubble great">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-thumbs-up"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </span>
                Great
              </div>
              <div className="rate-bubble bad">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-thumbs-down"
                  >
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                  </svg>
                </span>
                Bad
              </div>
            </div>
            <a className="transcript-chat">Need a Transcript?</a>
            <div className="powered-by">Powered by css3transition</div>
          </div>
        )}
      </div>
      <div className="chat-bot-icon" onClick={toggleClickIconChat}>
        {toggleChat ? <img src={Gloria2} /> : <img src={Gloria1} />}
      </div>
    </>
  );
};

export default ChatBot;
