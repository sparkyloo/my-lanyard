export const RESET_ALL = "all-state/reset";

export function resetAll() {
  return {
    type: RESET_ALL,
    payload: null,
  };
}
