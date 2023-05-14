import "./Lanyards.css";
import {
  useLanyardList,
  useLanyardCreationForm,
  useLanyardEditForm,
  useSession,
} from "../../state";
import { Filters, InfoModal, TopBar } from "../../components/TopBar";
import { Button } from "../../components/Button";
import { Grid } from "../../components/Grid";
import { Input } from "../../components/Input";
import { Image } from "../../components/Image";
import { FlexCol } from "../../components/FlexCol";
import { FlexRow } from "../../components/FlexRow";
import { Modal } from "../../components/Modal";
import { H2, P } from "../../components/Text";
import { ErrorList } from "../../components/ErrorList";
import { PageContent } from "../../components/PageContent";
import { CardGrid } from "../Cards";
import { EditTagging } from "../Tags";

export function LanyardsPage({ showSystemAssets }) {
  const {
    items,
    selected,
    selectedForEdit,
    selectItemForEdit,
    selectedItemAuthorId,
    resetSelections,
    selectItem,
    deselectItem,
    newFlow,
    editFlow,
    infoFlow,
    filterControls,
  } = useLanyardList(showSystemAssets.checked);

  const { session } = useSession();

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        <Filters {...filterControls} />
        <FlexRow gap={1}>
          {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
          <InfoModal flow={infoFlow}>
            {!!session ? (
              <P>
                This page is where you can view all the available tags. You can
                create new tags and edit the name of your existing tags.
              </P>
            ) : (
              <P>
                This page is where you can view all the premade lanyards. Click
                the view button to flip through their cards.
              </P>
            )}
          </InfoModal>
        </FlexRow>
      </TopBar>
      <LanyardGrid
        allowEdits
        allowTagging
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        selectItemForEdit={selectItemForEdit}
      />
      <Modal {...newFlow}>
        <CreateNewLanyard
          modalState={newFlow}
          showSystemAssets={showSystemAssets}
        />
      </Modal>
      <Modal {...editFlow}>
        <EditLanyard
          id={selectedForEdit}
          modalState={editFlow}
          showSystemAssets={showSystemAssets}
          authorId={selectedItemAuthorId}
        />
      </Modal>
    </PageContent>
  );
}

export function LanyardGrid({
  col = 4,
  colGap = 2,
  rowGap = 4,
  items = [],
  selected = [],
  selectItem,
  deselectItem,
  selectItemForEdit,
  allowEdits,
  allowTagging,
  ...props
}) {
  const { session } = useSession();

  allowEdits = !!session && !!allowEdits;
  allowTagging = !!session && !!allowTagging;

  return (
    <Grid col={col} colGap={colGap} rowGap={rowGap} {...props}>
      {items.map(({ id, name, cards }) => {
        const isSelected = selected.includes(`${id}`);

        return (
          <Button
            key={id}
            rounded
            noMouseEvents={!session}
            variant="plain"
            display="flex"
            direction="column"
            align="center"
            gap={1}
            padding={{ y: 1, x: 1 }}
            border={{
              all: true,
              color: isSelected ? "blue" : "light",
            }}
            outline={isSelected ? "blue" : null}
            onClick={() => {
              if (allowTagging) {
                selectItemForEdit(id);
              } else if (isSelected) {
                deselectItem(id);
              } else {
                selectItem(id);
              }
            }}
          >
            <div className="CardDisplay">
              {cards.slice(0, 5).map((card, i) => (
                <Image
                  key={card.id}
                  className={`CardPreview CardPreview_${i}`}
                  alt={card.name}
                  src={card.icon.imageUrl}
                  width={16}
                  height={16}
                  border={{
                    bottom: 1,
                    color: "light",
                  }}
                />
              ))}
            </div>
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
              {name}
            </P>
            <Button width="full" href={`/lanyards/${id}/card/0`}>
              view
            </Button>
          </Button>
        );
      })}
    </Grid>
  );
}

function CreateNewLanyard({ showSystemAssets, modalState }) {
  const {
    tagList,
    cardList,
    errorList,
    isPending,
    submitButton,
    nameInput,
    descriptionInput,
    dismissError,
  } = useLanyardCreationForm(showSystemAssets.checked, modalState);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Lanyard</H2>
        <Button onClick={modalState.toggle}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Description" disabled={isPending} {...descriptionInput} />
      <Filters {...cardList.filterControls} />
      <CardGrid
        rounded
        scroll="y"
        maxHeight={24}
        col={4}
        colGap={1}
        rowGap={1}
        border={{
          all: true,
          color: "light",
        }}
        padding={{
          x: 2,
          y: 1,
        }}
        items={cardList.items}
        selected={cardList.selected}
        selectItem={cardList.selectItem}
        deselectItem={cardList.deselectItem}
      />
      <EditTagging tagList={tagList} />
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditLanyard({ id, authorId, showSystemAssets, modalState }) {
  const {
    tagList,
    cardList,
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    descriptionInput,
    dismissError,
  } = useLanyardEditForm(id, showSystemAssets.checked, modalState);

  const { session } = useSession();

  const isMine = session?.id === authorId;
  const closeButton = <Button onClick={modalState.toggle}>Close</Button>;

  return (
    <FlexCol minWidth={40} gap={2}>
      {!!isMine && (
        <>
          <FlexRow justify="between">
            <H2>Edit Lanyard</H2>
            <Button onClick={modalState.toggle}>Close</Button>
          </FlexRow>
          <Input label="Name" disabled={isPending} {...nameInput} />
          <Input
            label="Description"
            disabled={isPending}
            {...descriptionInput}
          />
          <Filters {...cardList.filterControls} />
          <CardGrid
            rounded
            scroll="y"
            maxHeight={24}
            col={4}
            colGap={1}
            rowGap={1}
            border={{
              all: true,
              color: "light",
            }}
            padding={{
              x: 2,
              y: 1,
            }}
            items={cardList.items}
            selected={cardList.selected}
            selectItem={cardList.selectItem}
            deselectItem={cardList.deselectItem}
          />
          <ErrorList errors={errorList} dismissError={dismissError} />
        </>
      )}
      <EditTagging
        tagList={tagList}
        closeButton={!!isMine ? null : closeButton}
      />
      <FlexRow gap={2}>
        <Button flex={1} {...saveButton} disabled={isPending}>
          Save
        </Button>
        {!!isMine && (
          <Button flex={1} {...deleteButton} disabled={isPending}>
            Delete
          </Button>
        )}
      </FlexRow>
    </FlexCol>
  );
}
