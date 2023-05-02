import "./Tags.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as tags from "../../store/reducers/tags";
import { TopBar } from "../../components/TopBar";
import { Grid } from "../../components/Grid";
import { P } from "../../components/Text";

export function TagsPage({ showSystemAssets }) {
  const dispatch = useDispatch();
  const systemTags = useSelector(tags.getItems(showSystemAssets.checked));

  useEffect(() => {
    dispatch(tags.fetchItems());
  }, [showSystemAssets]);

  return (
    <>
      <TopBar showSystemAssets={showSystemAssets} />
      <Grid
        col={4}
        gap={1}
        margin={{
          x: 10,
        }}
      >
        {systemTags.map(({ name }) => (
          <P
            key={name}
            rounded
            border={{
              all: true,
              color: "light",
            }}
            padding={{
              x: 1,
              y: 1,
            }}
          >
            {name}
          </P>
        ))}
      </Grid>
    </>
  );
}
