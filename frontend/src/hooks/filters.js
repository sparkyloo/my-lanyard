import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getItems } from "../store/reducers/tags";
import { useInput } from "./input";
import { useForm } from "./form";

export function useFilters(items, includeSystemAssets) {
  const tags = useSelector(getItems(includeSystemAssets));

  const sortedTags = useMemo(() => {
    const mine = [];
    const system = [];

    for (const tag of tags) {
      if (tag.authorId === -1) {
        system.push(tag);
      } else {
        mine.push(tag);
      }
    }

    mine.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    system.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    return {
      mine,
      system,
    };
  }, [tags]);

  const [favorFiltered, setFavorFiltered] = useState(false);
  const [filtered, setFiltered] = useState(items);
  const tagSelect = useInput("");
  const searchInput = useInput("");
  const searchInputRef = useRef();
  const prevSearchValue = useRef(searchInput.value);

  const filterItems = useCallback(() => {
    setFavorFiltered(true);
    setFiltered(
      items.filter(({ name = "", taggings = [] }) => {
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
    prevSearchValue.current = searchInput.value;
    filterItems();
  });

  const prevTagValue = useRef(tagSelect.value);

  useEffect(() => {
    if (prevTagValue.current !== tagSelect.value) {
      prevTagValue.current = tagSelect.value;
      filterItems();
    }
  }, [tagSelect.value]);

  useEffect(() => {
    const enterHandler = (event) => {
      if (event.key === "Enter") {
        prevSearchValue.current = searchInput.value;
        filterItems();
      }
    };

    searchInputRef.current?.addEventListener("keypress", enterHandler);

    return () => {
      searchInputRef.current?.removeEventListener("keypress", enterHandler);
    };
  }, [filterItems]);

  const isDirty = useMemo(() => {
    return searchInput.value !== prevSearchValue.current;
  }, [searchInput.value]);

  if (!Array.isArray(filtered)) {
    throw new Error("items for useFilters must be an array");
  }

  return {
    filtered: favorFiltered ? filtered : items,
    filterControls: {
      tags,
      sortedTags,
      tagSelect,
      isDirty,
      searchButton: submitButton,
      searchInput: {
        ...searchInput,
        inputProps: {
          ref: searchInputRef,
        },
      },
    },
  };
}
