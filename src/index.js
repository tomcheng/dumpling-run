import React from "react";
import ReactDOM from "react-dom";
import get from "lodash/get";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const orientationLock = get(window, ["screen", "orientation", "lock"]);

if (orientationLock) {
  orientationLock("landscape").catch(e => {});
}

ReactDOM.render(<App />, document.getElementById("root"));

registerServiceWorker();
