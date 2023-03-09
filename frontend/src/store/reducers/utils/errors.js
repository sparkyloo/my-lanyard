export function handleApiErrors(caught, dispatch, errorItemsReducer) {
  const hasMessage = "message" in caught;
  const hasReasons = "reasons" in caught;

  if (hasMessage && hasReasons) {
    const { message, reasons } = caught;
    const issues = [];

    for (const content of [message, ...reasons]) {
      issues.push({
        id: Date.now(),
        content,
      });
    }

    dispatch(errorItemsReducer.trackItems(issues));
  } else {
    throw caught;
  }
}
