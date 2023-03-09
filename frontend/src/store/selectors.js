function createItemSelectors(getItems) {
  return [
    (id) => (state) => getItems(state)[id],
    (state) => Object.values(getItems(state)),
  ];
}

function createSelectionsSelectors(getSelections) {
  return [
    (id) => (state) => !!getSelections(state)[id],
    (state) => Object.keys(getSelections(state)),
  ];
}

export function selectSession(state) {
  return state.auth.session;
}

export function selectAuthStatus(state) {
  return !!selectSession(state);
}

export const [selectAuthError, selectAuthErrors] = createItemSelectors(
  (state) => state.auth.errors
);

export const [selectCard, selectCards] = createItemSelectors(
  (state) => state.cards.items
);

export const [selectCardError, selectCardErrors] = createItemSelectors(
  (state) => state.cards.errors
);

export const [selectCardSelectionStatus, selectCardSelections] =
  createSelectionsSelectors((state) => state.cards.selections);

export const [selectIcon, selectIcons] = createItemSelectors(
  (state) => state.icons.items
);

export const [selectIconError, selectIconErrors] = createItemSelectors(
  (state) => state.icons.errors
);

export const [selectIconSelectionStatus, selectIconSelections] =
  createSelectionsSelectors((state) => state.icons.selections);

export const [selectLanyard, selectLanyards] = createItemSelectors(
  (state) => state.lanyards.items
);

export const [selectLanyardError, selectLanyardErrors] = createItemSelectors(
  (state) => state.lanyards.errors
);

export const [selectLanyardSelectionStatus, selectLanyardSelections] =
  createSelectionsSelectors((state) => state.lanyards.selections);

export const [selectTag, selectTags] = createItemSelectors(
  (state) => state.tags.items
);

export const [selectTagError, selectTagErrors] = createItemSelectors(
  (state) => state.tags.errors
);

export const [selectTagSelectionStatus, selectTagSelections] =
  createSelectionsSelectors((state) => state.tags.selections);
