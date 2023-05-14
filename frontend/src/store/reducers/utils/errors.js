export const DISMISS_ALL = "all-errors/reset";

export function dismissErrors() {
  return {
    type: DISMISS_ALL,
    payload: null,
  };
}

export async function handleApiErrors(caught, dispatch, errorItemsReducer) {
  if (caught instanceof Response) {
    const contentType =
      caught.headers.get("Content-Type") || caught.headers.get("content-type");

    if (contentType.includes("application/json") && !caught.handled) {
      caught.handled = true;

      const body = await caught.json();
      const hasMessage = "message" in body;
      const hasReasons = "reasons" in body;

      if (hasMessage && hasReasons) {
        const { message, reasons } = body;
        const issues = [];

        if (!reasons.length) {
          issues.push({
            id: getIdForError(),
            content: message,
          });
        } else {
          for (const content of reasons) {
            issues.push({
              id: getIdForError(),
              content,
            });
          }
        }

        if (issues.length) {
          dispatch(errorItemsReducer.trackItems(issues));
        }
      }
    }
  }

  throw caught;
}

let lastTimestamp;
let previousId = null;

function getIdForError() {
  let timestamp = Date.now();
  let id;

  if (!lastTimestamp || lastTimestamp !== timestamp) {
    id = previousId = lastTimestamp = timestamp;
  } else if (lastTimestamp === timestamp) {
    id = previousId += 1;
  }

  return id;
}
