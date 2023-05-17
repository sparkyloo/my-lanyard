# my-lanyard (frontend)

## Routes

### `/`

> The splash page for unauthenticated users and the personal-info edit page for users that have logged in.

### `/lanyards`

> The page where you can create/manage your lanyards. You can also view the premade lanyards.

### `/lanyards/:id/card/:index`

> The page where you can cycle through the cards of a lanyard.

### `/cards`

> The page where you can create/manage your cards. You can also view the premade cards.

### `/icons`

> The page where you can create/manage your icons. You can also view the premade icons.

### `/tags`

> The page where you can create/manage your tags.

### `/login`

> The page where returning users can initiate a session.

### `/signup`

> The page where new users can be created.

### `/*`

> The catch-all route that serves as the 404 page.

## Redux Store

### Reducer Abstractions

#### `items`

> An object of objects keyed by the `id` property of the value objects. Items can be added/updated/removed individually or in bulk.

#### `items-status`

> An object that tracks if it's corresponding `items` reducer has completed the initial fetch. It also tracks the count of pending fetch calls that haven't completed yet.

#### `errors`

> A specialized version of an `items` reducer that holds any API errors encountered.

#### `selections`

> An object of `true` keyed by the `id` property of value objects of an `items` reducer.

### Reducers

#### `auth`

> Holds the current user object _(if the user is logged in)_ and whether the session has been checked yet. It also contains an `errors` sub-reducer.

#### `icons`

> Holds all the data that is used on the `/icons` page. It is composed of a `status`, `items`, `errors` and `selections` sub-reducers. Each icon has it's tagging data nested inside their item.

#### `cards`

> Holds all the data that is used on the `/cards` page. It is composed of a `status`, `items`, `errors` and `selections` sub-reducers. Each card has it's icon/tagging data nested inside their item.

#### `lanyards`

> Holds all the data that is used on the `/lanyards` page. It is composed of a `status`, `items`, `errors` and `selections` sub-reducers. Each lanyard has it's card/tagging data nested inside their item.

#### `tags`

> Holds all the data that is used on the `/tags` page. It is composed of a `status`, `items`, `errors` and `selections` sub-reducers. The items are used in the tag-select filter found on various pages.

## Components

### Design System

> The majority of the styling in the app is powerd by a large list of CSS classes that represent a small set of style rules. Some of these classes have a number of variants that can be applied to scale the style rules they represent in a predictable way. Each component uses a utility function `prepareStyles` to process their props and conditionally apply the classes of the design system.

#### `<Button />`

> A button component with a few variants and a default style. It enhances the click handler _(if provided)_ allows for a few boolean props to tweak its behavior. It also accepts an `href` prop which will switch the internal tag from a `<button/>` to a `<NavLink />` while keeping the button-like styling.

#### `<Input />`

> A text field component with convience props for adding a styled `<Label />` and implements a default style.

#### `<Radio />`

> Similar to `<Input />` except assumes `type="radio"`.

#### `<Checkbox />`

> Similar to `<Input />` except assumes `type="checkbox"`.

#### `<DropDown />`

> A select component with convience props for adding a styled `<Label />` and implements a default style. Options can be provided as an array-of-objects or an array-of-array-tuple. If the latter form of options is being provided, the tuple should be a string and an array-of-objects. This will allow you to group your options with an `<optgroup />`

#### `<Image />`

> A thin wrapper of `<img />` that will relay props to `prepareStyles` for convenient styling.

#### `<Modal />`

> A popup component with a light gray backdrop and a white card content fixed to the center of the screen. The backdrop implicitly will capture clicks outside of the card and automatically close the model. The modal will prevent the rest of the page from scrolling while it is open.

#### `<ErrorList />`

> Renders API errors as a list of `<p/>` tags with a corresponding "Dismiss" button.

#### `<Tabs />`

> The main navigation UI for the app. Internally built with a set of `<Radio />` components with some specialized styling.

#### `<PageContent />`

> A thin wrapper of `<div />` used as the default layout of pages.

#### `<FlexCol />`

> A thin wrapper of `<div />` assuming `flex` styles in a `column` direction. It will relay props to `prepareStyles` for convenient styling.

#### `<FlexRow />`

> A thin wrapper of `<div />` assuming `flex` styles in a `row` direction. It will relay props to `prepareStyles` for convenient styling.

#### `<Grid />`

> A thin wrapper of `<div />` assuming `grid` styles. It will relay props to `prepareStyles` for convenient styling.

### Text Components

#### `<H1 />`

> A thin wrapper of `<h1 />` that will relay props to `prepareStyles` for convenient styling.

#### `<H2 />`

> A thin wrapper of `<h2 />` that will relay props to `prepareStyles` for convenient styling.

#### `<H3 />`

> A thin wrapper of `<h3 />` that will relay props to `prepareStyles` for convenient styling.

#### `<P />`

> A thin wrapper of `<p />` that will relay props to `prepareStyles` for convenient styling.

#### `<Span />`

> A thin wrapper of `<span />` that will relay props to `prepareStyles` for convenient styling.

#### `<Label />`

> A thin wrapper of `<label />` that will relay props to `prepareStyles` for convenient styling.
