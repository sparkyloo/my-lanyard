import { useState } from "react";
import { useSelector } from "react-redux";
import { getItems } from "../store/reducers/tags";
import { useInput } from "./input";
import { useForm } from "./form";

export function useFilters(items, includeSystemAssets) {
  const tags = useSelector(getItems(includeSystemAssets));

  const [filtered, setFiltered] = useState(items);
  const tagSelect = useInput("");
  const searchInput = useInput("");

  const { submitButton } = useForm(() => {
    setFiltered(
      items.filter(({ name, taggings = [] }) => {
        if (searchInput.value && !name.includes(searchInput.value)) {
          return false;
        }

        if (
          tagSelect.value &&
          !taggings.find(({ tagId }) => `${tagSelect.value}` === `${tagId}`)
        ) {
          return false;
        }

        return true;
      })
    );
  });

  if (!Array.isArray(filtered)) {
    throw new Error("items for useFilters must be an array");
  }

  return {
    filtered: !searchInput.value ? items : filtered,
    filterControls: {
      tags,
      tagSelect,
      searchInput,
      searchButton: submitButton,
    },
  };
}
