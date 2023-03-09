import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import auth from "./reducers/auth";
import cards, { fetchSystemCards } from "./reducers/cards";
import icons, { fetchSystemIcons } from "./reducers/icons";
import lanyards, { fetchSystemLanyards } from "./reducers/lanyards";
import tags, { fetchSystemTags } from "./reducers/tags";

const rootReducer = combineReducers({
  auth,
  cards,
  icons,
  lanyards,
  tags,
});

window.fetchSystemCards = fetchSystemCards;
window.fetchSystemIcons = fetchSystemIcons;
window.fetchSystemLanyards = fetchSystemLanyards;
window.fetchSystemTags = fetchSystemTags;

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
