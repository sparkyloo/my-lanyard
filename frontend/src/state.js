import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useModal } from "./hooks/modal";
import { useCheckbox } from "./hooks/checkbox";
import { useFilters } from "./hooks/filters";
import { useInput } from "./hooks/input";
import { useForm } from "./hooks/form";
import { dismissErrors } from "./store/reducers/utils/errors";
import * as authState from "./store/reducers/auth";
import * as cardState from "./store/reducers/cards";
import * as iconState from "./store/reducers/icons";
import * as lanyardState from "./store/reducers/lanyards";
import * as tagState from "./store/reducers/tags";
import { deselectAll } from "./store/reducers/utils/selection";

export function useSession() {
  const dispatch = useDispatch();
  const session = useSelector(authState.getSession);

  const doLogout = useCallback(() => dispatch(authState.destroySession()), []);

  const doLoginAsDemo = useCallback(
    () => dispatch(authState.startDemoSession()),
    []
  );

  return {
    session,
    doLogout,
    doLoginAsDemo,
  };
}

export function useAppState() {
  const history = useHistory();
  const dispatch = useDispatch();
  const appReady = useSelector(authState.isAppReady);

  const [showSystemAssets] = useCheckbox(true);

  useEffect(() => {
    dispatch(authState.checkSession());
  }, []);

  useEffect(() => {
    return history.listen(() => {
      dispatch(dismissErrors());
      dispatch(deselectAll());
    });
  }, [history, dispatch]);

  return {
    appReady,
    showSystemAssets,
  };
}

function useReduxList(topic, includeSystemAssets) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(topic.fetchItems());
  }, []);

  const items = useSelector(topic.getItems(includeSystemAssets));
  const selected = useSelector(topic.getSelected);

  const [selectedForEdit, selectItemForEdit] = useState(null);
  const [selectedForTagging, selectItemForTagging] = useState(null);

  const newFlow = useModal();
  const editFlow = useModal();
  const taggingFlow = useModal();

  useEffect(() => {
    if (selectedForEdit) {
      editFlow.forceModalState(true);
    }
  }, [selectedForEdit]);

  useEffect(() => {
    if (!editFlow.show) {
      selectItemForEdit(null);
    }
  }, [editFlow.show]);

  useEffect(() => {
    if (selectedForTagging) {
      taggingFlow.forceModalState(true);
    }
  }, [selectedForTagging]);

  useEffect(() => {
    if (!taggingFlow.show) {
      selectItemForTagging(null);
    }
  }, [taggingFlow.show]);

  const resetSelections = useCallback(() => {
    dispatch(topic.selections.reset());
  }, []);

  const selectItem = useCallback((id) => {
    dispatch(topic.selections.pick(id));
  }, []);

  const deselectItem = useCallback((id) => {
    dispatch(topic.selections.forget(id));
  }, []);

  return {
    items,
    selected,
    selectedForEdit,
    selectItemForEdit,
    selectedForTagging,
    selectItemForTagging,
    newFlow,
    editFlow,
    taggingFlow,
    resetSelections,
    selectItem,
    deselectItem,
  };
}

function useLimitedReduxList(topic, includeSystemAssets) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(topic.fetchItems());
  }, []);

  const items = useSelector(topic.getItems(includeSystemAssets));
  const selected = useSelector(topic.getSelected);

  const previousSelected = useRef(selected);

  useEffect(() => {
    if (selected.length > 1) {
      for (const id of previousSelected.current) {
        dispatch(topic.selections.forget(id));
      }
    }

    previousSelected.current = selected;
  }, [selected]);

  const selectItem = useCallback((id) => {
    dispatch(topic.selections.pick(id));
  }, []);

  const deselectItem = useCallback((id) => {
    dispatch(topic.selections.forget(id));
  }, []);

  return {
    items,
    selected,
    selectItem,
    deselectItem,
  };
}

export function useAppStatus() {
  return useSelector(authState.isAppReady);
}

export function useAuthErrors() {
  return useSelector(authState.getErrors);
}

export function useLogin() {
  const dispatch = useDispatch();

  const history = useHistory();
  const errorList = useAuthErrors();

  const dismissError = useCallback((errId) => {
    dispatch(authState.errors.untrackItem(errId));
  }, []);

  const emailInput = useInput("");
  const passwordInput = useInput("");

  const { isPending, submitButton } = useForm(async (dispatch) => {
    await dispatch(
      authState.startSession(emailInput.value, passwordInput.value)
    );

    history.replace("/");
  });

  return {
    emailInput,
    passwordInput,
    isPending,
    submitButton,
    errorList,
    dismissError,
  };
}

export function useIconList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(iconState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedIconList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(
    iconState,
    includeSystemAssets
  );
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useIconCreationForm(close) {
  const dispatch = useDispatch();
  const errorList = useSelector(iconState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(iconState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");
  const imageUrlInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(iconState.createItem(nameInput.value, imageUrlInput.value));
    close();
  });

  return {
    errorList,
    isPending,
    nameInput,
    imageUrlInput,
    submitButton,
    dismissError,
  };
}

export function useIconEditForm(id, close) {
  const dispatch = useDispatch();
  const errorList = useSelector(iconState.getErrors);
  const icon = useSelector(iconState.getItem(id));

  const dismissError = useCallback((errId) => {
    dispatch(iconState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(icon.value || "");
  const imageUrlInput = useInput(icon.imageUrl || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(
        iconState.updateItem(id, nameInput.value, imageUrlInput.value)
      );
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(iconState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    errorList,
    savePending,
    deletePending,
    isPending,
    nameInput,
    imageUrlInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useCardList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(cardState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedCardList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(
    cardState,
    includeSystemAssets
  );

  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useCardCreationForm(includeSystemAssets, close) {
  const dispatch = useDispatch();
  const iconList = useLimitedIconList(includeSystemAssets);
  const errorList = useSelector(iconState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(cardState.errors.untrackItem(errId));
  }, []);

  const textInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(cardState.createItem(textInput.value, iconList.selected[0]));
    close();
  });

  return {
    iconList,
    errorList,
    isPending,
    textInput,
    submitButton,
    dismissError,
  };
}

export function useCardEditForm(id, includeSystemAssets, close) {
  const dispatch = useDispatch();
  const iconList = useLimitedIconList(includeSystemAssets);
  const errorList = useSelector(cardState.getErrors);
  const card = useSelector(cardState.getItem(id));

  const dismissError = useCallback((errId) => {
    dispatch(cardState.errors.untrackItem(errId));
  }, []);

  const textInput = useInput(card?.name || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(
        cardState.updateItem(id, textInput.value, iconList.selected[0])
      );
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(cardState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    iconList,
    errorList,
    savePending,
    deletePending,
    isPending,
    textInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useLanyard() {
  const { id, index } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(lanyardState.fetchItems());
  }, []);

  const lanyard = useSelector(lanyardState.getItem(id));
  const cards = lanyard?.cards || [];

  const i = useMemo(() => {
    return parseInt(index);
  }, [index]);

  const card = useMemo(() => cards[i], [cards, i]);

  console.log({
    cards,
    card,
    i,
  });

  const gotoPrev = useCallback(() => {
    let prev = i - 1;

    if (prev < 0) {
      prev = cards.length - 1;
    }

    history.push(`/lanyards/${id}/card/${prev}`);
  }, [id, i, cards]);

  const gotoNext = useCallback(() => {
    let next = i + 1;

    if (next >= cards.length) {
      next = 0;
    }

    history.push(`/lanyards/${id}/card/${next}`);
  }, [id, i, cards]);

  return {
    card,
    gotoPrev,
    gotoNext,
  };
}

export function useLanyardList(includeSystemAssets) {
  const history = useHistory();
  const { items, ...rest } = useReduxList(lanyardState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  const viewItem = useCallback(
    (id) => {
      history.push(`/lanyards/${id}/card/0`);
    },
    [history]
  );

  return {
    ...rest,
    items: filtered,
    filterControls,
    viewItem,
  };
}

export function useLimitedLanyardList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(
    lanyardState,
    includeSystemAssets
  );

  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLanyardCreationForm(includeSystemAssets, close) {
  const dispatch = useDispatch();
  const cardList = useCardList(includeSystemAssets);
  const errorList = useSelector(lanyardState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(lanyardState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");
  const descriptionInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(
      lanyardState.createItem(
        nameInput.value,
        descriptionInput.value,
        cardList.selected
      )
    );
    close();
  });

  return {
    cardList,
    errorList,
    isPending,
    nameInput,
    descriptionInput,
    submitButton,
    dismissError,
  };
}

export function useLanyardEditForm(id, includeSystemAssets, close) {
  const dispatch = useDispatch();
  const cardList = useLimitedCardList(includeSystemAssets);
  const errorList = useSelector(lanyardState.getErrors);
  const lanyard = useSelector(lanyardState.getItem(id));

  const dismissError = useCallback((errId) => {
    dispatch(lanyardState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(lanyard?.name || "");
  const descriptionInput = useInput(lanyard?.description || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(
        lanyardState.updateItem(
          id,
          nameInput.value,
          descriptionInput.value,
          cardList.selected
        )
      );
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(lanyardState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    cardList,
    errorList,
    savePending,
    deletePending,
    isPending,
    nameInput,
    descriptionInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useTagList(includeSystemAssets) {
  const { items, ...rest } = useReduxList(tagState, includeSystemAssets);
  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useLimitedTagList(includeSystemAssets) {
  const { items, ...rest } = useLimitedReduxList(tagState, includeSystemAssets);

  const { filtered, filterControls } = useFilters(items, includeSystemAssets);

  return {
    ...rest,
    items: filtered,
    filterControls,
  };
}

export function useTagCreationForm(close) {
  const dispatch = useDispatch();
  const errorList = useSelector(tagState.getErrors);

  const dismissError = useCallback((errId) => {
    dispatch(tagState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput("");

  const { isPending, submitButton } = useForm(async () => {
    await dispatch(tagState.createItem(nameInput.value));
    close();
  });

  return {
    errorList,
    isPending,
    nameInput,
    submitButton,
    dismissError,
  };
}

export function useTagEditForm(id, close) {
  const dispatch = useDispatch();
  const errorList = useSelector(tagState.getErrors);
  const tag = useSelector(tagState.getItem(id));

  const dismissError = useCallback((errId) => {
    dispatch(tagState.errors.untrackItem(errId));
  }, []);

  const nameInput = useInput(tag?.name || "");

  const { isPending: savePending, submitButton: saveButton } = useForm(
    async () => {
      await dispatch(tagState.updateItem(id, nameInput.value));
      close();
    }
  );

  const { isPending: deletePending, submitButton: deleteButton } = useForm(
    async () => {
      await dispatch(tagState.deleteItem(id));
      close();
    }
  );

  const isPending = savePending || deletePending;

  return {
    errorList,
    savePending,
    deletePending,
    isPending,
    nameInput,
    saveButton,
    deleteButton,
    dismissError,
  };
}

export function useTaggingForm(kind, id, close) {
  let getItem;
  let updateTagging;
  let getErrors;
  let untrackError;

  switch (kind) {
    case "icons": {
      getItem = iconState.getItem;
      updateTagging = iconState.updateTagging;
      getErrors = iconState.getErrors;
      untrackError = iconState.errors.untrackItem;
      break;
    }
    case "cards": {
      getItem = cardState.getItem;
      updateTagging = cardState.updateTagging;
      getErrors = cardState.getErrors;
      untrackError = cardState.errors.untrackItem;
      break;
    }
    case "lanyards": {
      getItem = lanyardState.getItem;
      updateTagging = lanyardState.updateTagging;
      getErrors = lanyardState.getErrors;
      untrackError = lanyardState.errors.untrackItem;
      break;
    }
    default: {
      throw new Error(`Invalid tagging kind: "${kind}"`);
    }
  }

  const dispatch = useDispatch();
  const tagList = useTagList(false);
  const errorList = useSelector(getErrors);
  const selectedItem = useSelector(getItem(id));
  const selectedTags = tagList.selected.map((id) =>
    typeof id === "string" ? parseInt(id) : id
  );
  const assignments = useMemo(
    () =>
      selectedItem.taggings.map(({ tagId }) =>
        typeof tagId === "string" ? parseInt(tagId) : tagId
      ),
    [selectedItem]
  );

  useEffect(() => {
    for (const { tagId } of selectedItem.taggings) {
      dispatch(tagState.selections.pick(tagId));
    }

    return () => {
      dispatch(tagState.selections.reset());
    };
  }, []);

  const dismissError = useCallback((errId) => {
    dispatch(untrackError(errId));
  }, []);

  const { isPending, submitButton: saveButton } = useForm(async () => {
    const toAdd = new Set();
    const toRemove = new Set();

    for (const id of selectedTags) {
      if (!assignments.includes(id)) {
        toAdd.add(id);
      }
    }

    for (const id of assignments) {
      if (!selectedTags.includes(id)) {
        toRemove.add(id);
      }
    }

    await dispatch(updateTagging(id, Array.from(toAdd), Array.from(toRemove)));

    close();
  });

  return {
    tagList,
    errorList,
    isPending,
    saveButton,
    dismissError,
  };
}
