import throttle from "lodash/throttle";

const LOCAL_STORAGE_KEY = "__dumpling-run-game-state__";

export const getSavedState = () => {
  const json = localStorage.getItem(LOCAL_STORAGE_KEY);
  return json && JSON.parse(json);
};

export const saveState = throttle(state => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}, 2000);
