import "./LanyardView.css";
import { useLanyard } from "../../state";
import { TopBar } from "../../components/TopBar";
import { Button } from "../../components/Button";
import { Image } from "../../components/Image";
import { P } from "../../components/Text";
import { FlexRow } from "../../components/FlexRow";
import { PageContent } from "../../components/PageContent";
import { FlexCol } from "../../components/FlexCol";

export function LanyardViewPage({ showSystemAssets }) {
  const { card, gotoPrev, gotoNext } = useLanyard(showSystemAssets.checked);

  if (!card) {
    return null;
  }

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets} />
      <FlexCol>
        <FlexRow gap={1} align="center">
          <Button height={48} onClick={gotoPrev}>
            {"<"}
          </Button>
          <Image
            key={card.name}
            alt={card.name}
            src={card.icon.imageUrl}
            width={48}
            height={48}
            border={{
              bottom: 1,
              color: "light",
            }}
          />
          <Button height={48} onClick={gotoNext}>
            {">"}
          </Button>
        </FlexRow>
        {!!card.text && (
          <P
            rounded
            width="full"
            bg="white"
            border={{
              all: true,
              color: "light",
            }}
            padding={{
              x: 0.5,
              y: 0.5,
            }}
          >
            {card.text}
          </P>
        )}
      </FlexCol>
    </PageContent>
  );
}
