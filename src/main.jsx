import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import "./index.scss";

import "./assets/css/animated-headline.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/bootstrap-select.min.css";
import "./assets/css/bootstrap-tagsinput.css";
import "./assets/css/emojionearea.css";
import "./assets/css/fancybox.css";
import "./assets/css/intlTelInput.min.css";
import "./assets/css/jquery-te-1.4.0.css";
import "./assets/css/leaflet.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/owl.theme.default.min.css";
import "./assets/css/plyr.css";
import "./assets/css/style.css";
import "./assets/css/tooltipster.bundle.css";
import "./assets/css/personalizado.css";

// Fuente DM Sans
import "@fontsource/dm-sans/100.css";
import "@fontsource/dm-sans/200.css";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/dm-sans/800.css";
import "@fontsource/dm-sans/900.css";

// Iconos
import "font-awesome/css/font-awesome.min.css";
import "./assets/css/line-awesome.css";

const link = document.createElement("link");
link.href =
  "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
