import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const privacyBlurRedirect = window.sessionStorage.getItem("privacyblur:redirect");

if (privacyBlurRedirect) {
  window.sessionStorage.removeItem("privacyblur:redirect");
  window.history.replaceState(null, "", privacyBlurRedirect);
}

createRoot(document.getElementById("root")!).render(<App />);
