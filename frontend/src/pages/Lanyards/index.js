import "./Lanyards.css";
import {
  useLanyardList,
  useLanyardCreationForm,
  useLanyardEditForm,
  useSession,
} from "../../state";
import { Filters, TopBar } from "../../components/TopBar";
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
    selectedForTagging,
    selectItemForTagging,
    resetSelections,
    selectItem,
    deselectItem,
    newFlow,
    editFlow,
    taggingFlow,
    filterControls,
    viewItem,
  } = useLanyardList(showSystemAssets.checked);

  const { session } = useSession();

  return (
    <PageContent>
      <TopBar showSystemAssets={showSystemAssets}>
        {!!session && <Button onClick={newFlow.toggle}>Create New</Button>}
        <Filters {...filterControls} />
        <Button disabled={!selected.length} onClick={resetSelections}>
          Deselect All
        </Button>
      </TopBar>
      <LanyardGrid
        allowEdits
        allowTagging
        items={items}
        selected={selected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        viewItem={viewItem}
        selectItemForEdit={selectItemForEdit}
        selectItemForTagging={selectItemForTagging}
      />
      <Modal {...newFlow}>
        {!!newFlow.show && (
          <CreateNewLanyard
            close={newFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...editFlow}>
        {!!selectedForEdit && (
          <EditLanyard
            id={selectedForEdit}
            close={editFlow.toggle}
            showSystemAssets={showSystemAssets}
          />
        )}
      </Modal>
      <Modal {...taggingFlow}>
        {!!taggingFlow.show && (
          <EditTagging
            kind="lanyards"
            id={selectedForTagging}
            close={taggingFlow.toggle}
          />
        )}
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
  selectItemForTagging,
  allowEdits,
  allowTagging,
  viewItem,
  ...props
}) {
  const { session } = useSession();

  allowEdits = !!session && !!allowEdits;
  allowTagging = !!session && !!allowTagging;

  return (
    <Grid col={col} colGap={colGap} rowGap={rowGap} {...props}>
      {items.map(({ id, authorId, name, cards }) => {
        const isSelected = selected.includes(`${id}`);
        const isMine = session?.id === authorId;

        return (
          <Button
            key={id}
            rounded
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
              if (isSelected) {
                deselectItem(id);
              } else {
                selectItem(id);
              }
            }}
          >
            <div className="CardDisplay">
              {cards.slice(0, 5).map((card, i) => (
                <Image
                  className={`CardPreview CardPreview_${i}`}
                  key={card.name}
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
              key={name}
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
            <FlexCol gap={0.5}>
              <FlexRow gap={0.5}>
                <Button
                  margin={{
                    bottom: 0.25,
                  }}
                  onClick={() => viewItem(id)}
                >
                  view
                </Button>
                {!!isMine && !!allowEdits && (
                  <Button
                    margin={{
                      bottom: 0.25,
                    }}
                    onClick={() => selectItemForEdit(id)}
                  >
                    edit
                  </Button>
                )}
              </FlexRow>
              {!!allowTagging && (
                <Button onClick={() => selectItemForTagging(id)}>tags</Button>
              )}
            </FlexCol>
          </Button>
        );
      })}
    </Grid>
  );
}

function CreateNewLanyard({ showSystemAssets, close }) {
  const {
    cardList,
    errorList,
    isPending,
    submitButton,
    nameInput,
    descriptionInput,
    dismissError,
  } = useLanyardCreationForm(showSystemAssets.checked, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Create Lanyard</H2>
        <Button onClick={close}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Description" disabled={isPending} {...descriptionInput} />
      <Filters {...cardList.filterControls} />
      <CardGrid
        rounded
        scroll="y"
        maxHeight={48}
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
      <Button {...submitButton} disabled={isPending}>
        Save
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}

function EditLanyard({ id, showSystemAssets, close }) {
  const {
    cardList,
    errorList,
    isPending,
    saveButton,
    deleteButton,
    nameInput,
    descriptionInput,
    dismissError,
  } = useLanyardEditForm(id, showSystemAssets.checked, close);

  return (
    <FlexCol minWidth={40} gap={2}>
      <FlexRow justify="between">
        <H2>Edit Lanyard</H2>
        <Button onClick={() => close()}>Close</Button>
      </FlexRow>
      <Input label="Name" disabled={isPending} {...nameInput} />
      <Input label="Description" disabled={isPending} {...descriptionInput} />
      <Filters {...cardList.filterControls} />
      <CardGrid
        rounded
        scroll="y"
        maxHeight={48}
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
      <Button {...saveButton} disabled={isPending}>
        Save
      </Button>
      <Button {...deleteButton} disabled={isPending}>
        Delete
      </Button>
      <ErrorList errors={errorList} dismissError={dismissError} />
    </FlexCol>
  );
}
