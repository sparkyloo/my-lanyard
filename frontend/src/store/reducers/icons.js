import { combineReducers } from "redux";
import { csrfFetch } from "../csrf";
import { handleApiErrors, DISMISS_ERRORS } from "./utils/errors";
import { createItemsReducer, createStatusReducer } from "./utils/items";
import { createSelectionReducer } from "./utils/selection";
import { items as tagItemsReducer } from "./tags";

export const status = createStatusReducer("icon-loading");
export const items = createItemsReducer("icon-data");
export const errors = createItemsReducer("icon-errors", DISMISS_ERRORS);
export const assignment = createItemsReducer("icon-assignment");
export const selections = createSelectionReducer("icon-selections");

export function fetchItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons/instance/${id}`);

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
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function fetchItems() {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons`);

      dispatch(items.trackItems(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function createItem(name, imageUrl) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons`, {
        method: "POST",
        body: {
          name,
          imageUrl,
        },
      });

      dispatch(items.trackItem(await response.json()));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function deleteItem(id) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      await csrfFetch(`/api/icons/instance/${id}`, {
        method: "DELETE",
      });

      dispatch(items.untrackItem(id));
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export function updateItem(id, name, imageUrl) {
  return async (dispatch) => {
    try {
      dispatch(status.pending());

      const response = await csrfFetch(`/api/icons/instance/${id}`, {
        method: "PATCH",
        body: {
          name,
          imageUrl,
        },
      });

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
    } catch (caught) {
      await handleApiErrors(caught, dispatch, errors);
    } finally {
      dispatch(status.finished());
    }
  };
}

export default combineReducers({
  status,
  items,
  errors,
  assignment,
  selections,
});

export function getItems(includeSystemIcons) {
  return ({ icons }) =>
    includeSystemIcons
      ? Object.values(icons.items)
      : Object.values(icons.items).filter((item) => item.authorId !== -1);
}

export function getErrors({ icons }) {
  return Object.values(icons.errors);
}

export function getSelected({ icons }) {
  return Object.keys(icons.selections);
}
