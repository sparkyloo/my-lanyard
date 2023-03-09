import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors } from "./utils/errors";
import { createItemsReducer } from "./utils/items";
import { createSelectionReducer } from "./utils/selection";

export const items = createItemsReducer("tag-data");
export const errors = createItemsReducer("tag-errors");
export const selection = createSelectionReducer("tag-selection");

export function fetchSystemTags(id) {
  return async (dispatch) => {
    try {
      if (id) {
        const response = await csrfFetch(
          `/api/system-assets/tags/instance/${id}`
        );

        dispatch(items.trackItem(await response.json()));
      } else {
        const response = await csrfFetch("/api/system-assets/tags");

        dispatch(items.trackItems(await response.json()));
      }
    } catch (caught) {
      handleApiErrors(caught, dispatch, errors);
    }
  };
}

export default combineReducers({
  items,
  errors,
  selection,
});
