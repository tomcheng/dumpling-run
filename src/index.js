import React from "react";
import {createRoot} from "react-dom/client";
import get from "lodash/get";
import "./index.css";
import AppContainer from "./components/AppContainer";
import registerServiceWorker from "./registerServiceWorker";

const orientationLock = get(window, ["screen", "orientation", "lock"]);

if (orientationLock) {
  orientationLock("landscape").catch(e => {});
}

const root = createRoot(document.getElementById("root"));
root.render(<AppContainer />)

registerServiceWorker();
