import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getItems } from "../store/reducers/tags";
import { useInput } from "./input";
import { useForm } from "./form";

export function useFilters(items, includeSystemAssets) {
  const tags = useSelector(getItems(includeSystemAssets));

  const [favorFiltered, setFavorFiltered] = useState(false);
  const [filtered, setFiltered] = useState(items);
  const tagSelect = useInput("");
  const searchInput = useInput("");

  const filterItems = useCallback(() => {
    setFavorFiltered(true);
    setFiltered(
      items.filter(({ name, taggings = [] }) => {
        if (searchInput.value) {
          if (name.includes(searchInput.value)) {
            return true;
          } else {
            return false;
          }
        }

        if (tagSelect.value) {
          if (
            taggings.find(({ tagId }) => `${tagSelect.value}` === `${tagId}`)
          ) {
            return true;
          } else {
            return false;
          }
        }

        return true;
      })
    );
  }, [items, searchInput.value, tagSelect.value]);

  const { submitButton } = useForm(() => {
    filterItems();
  });

  const prevTagValue = useRef(tagSelect.value);

  useEffect(() => {
    if (prevTagValue.current !== tagSelect.value) {
      prevTagValue.current = tagSelect.value;
      filterItems();
    }
  }, [tagSelect.value]);

  if (!Array.isArray(filtered)) {
    throw new Error("items for useFilters must be an array");
  }

  return {
    filtered: favorFiltered ? filtered : items,
    filterControls: {
      tags,
      tagSelect,
      searchInput,
      searchButton: submitButton,
    },
  };
}
