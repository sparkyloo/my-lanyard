import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors } from "./utils/errors";
import { createItemsReducer } from "./utils/items";
import { createSelectionReducer } from "./utils/selection";
import { items as tagItemsReducer } from "./tags";

export const items = createItemsReducer("lanyard-data");
export const errors = createItemsReducer("lanyard-errors");
export const assignment = createItemsReducer("lanyard-assignment");
export const selections = createSelectionReducer("lanyard-selections");

export function fetchSystemLanyards(id) {
  return async (dispatch) => {
    try {
      if (id) {
        const response = await csrfFetch(
          `/api/system-assets/lanyards/instance/${id}`
        );

        const { taggings, ...instance } = await response.json();
        const taggingItems = [];
        const tagItems = [];

        dispatch(items.trackItem(instance));

        for (const { tag, ...tagging } of taggings) {
          taggingItems.push(tagging);
          tagItems.push(tag);
        }

        dispatch(assignment.trackItems(taggingItems));
        dispatch(tagItemsReducer.trackItems(tagItems));
      } else {
        const response = await csrfFetch("/api/system-assets/lanyards");

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
  assignment,
  selections,
});
