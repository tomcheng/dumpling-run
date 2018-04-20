import throttle from "lodash/throttle";

const GAME_STATE_KEY = "__dumpling-run-game-state__";
const HIGH_SCORE_KEY = "__dumpling-run-high-score";

export const getSavedState = () => {
  const json = localStorage.getItem(GAME_STATE_KEY);
  return json && JSON.parse(json);
};

export const saveState = throttle(state => {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}, 2000);

const DEFAULT_HIGH_SCORES = { level: 1, score: 0 };

export const getHighScore = () => {
  const json = localStorage.getItem(HIGH_SCORE_KEY);
  return json ? JSON.parse(json) : DEFAULT_HIGH_SCORES;
};

export const updateHighScore = ({ level, score }) => {
  const json = localStorage.getItem(HIGH_SCORE_KEY);
  const current = json ? JSON.parse(json) : DEFAULT_HIGH_SCORES;
  const newScores = {
    level: Math.max(level, current.level),
    score: Math.max(score, current.score)
  };

  localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(newScores));
};
