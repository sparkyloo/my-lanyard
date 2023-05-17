# my-lanyard

- [link to live site](https://lanyards.onrender.com/)
- [frontend document](./frontend/README.md)
- [backend document](./backend/README.md)

## Overview

> The hope is that this app will help educators and caretakers communicate with special-needs people.

### Catalog of Lanyards

![lanyard screen](./lanyard_screen.png)

### Edit a Lanyard

![lanyard edit](./lanyard_edit.png)

### Display the Cards in a Lanyards

![lanyard view](./lanyard_view.png)

## Features

### Icons

> Icons are a named image URL; the building blocks of cards. They should be simple images that communicate a single idea.

### Cards

> Cards are an Icon and optionally a snippet of text. Multiple cards may use the same Icon.

### Lanyards

> Lanyards are a named collection of cards and can optionally have a description. Lanyards own their cards and cards cannot be shared between lanyards. If you want to use the same card twice, you should create a duplicate card.

### Tags

> Tags are a way of arbitrarily grouping Icons, Cards, and/or Lanyards. The should be used to organize your items and speed up the search process when composing Cards or Lanyards.

### Users

> Users can only see the items they have created and the premade items. This app is meant to be a utility for educators and caretakers so there is little value in users being able to see content created by other users.

### Premade Items

> The app is seeded with a handful of Icons and Cards that can be seen/used by any user along with a few sample Lanyards. These items are owned by a special user and cannot be edited. A user can assign their personal tags to premade items but they will not impact other users.

## Tech-Stack

- Javascript
- CSS
- SQL/Postgres
- Sequelize
- Express
- React
- Redux
- Docker

## Getting Started

### Local Development

> before proceeding make sure you create a `.env` file in your `backend` folder with content like this:

```
PORT=8000
DB_FILE=db/dev.db
JWT_SECRET=supersecret
JWT_EXPIRES_IN=604800
SCHEMA=icons
DATABASE_URL=postgres://postgres:password@localhost:5432/postgres
```

1. Run `npm install` at the root of this repo
2. In another terminal tab, run `sh backend/start-postgres.sh`. This will start your database in Docker and run all the Sequelize setup scripts.
3. In another terminal tab, run `cd backend` then `npm start`. This will start your express server in development mode.
4. In another terminal tab, run `cd frontend` then `npm start`. This will start your react-app in development mode.

## TODO _(future improvements)_

- [ ] allow users to create/edit icons and cards from the lanyards page. It is kinda clunky to have to switch pages to make edits.
- [ ] allow users to upload images directly instead of just entering an image URL.
- [ ] replace the custom design system with [tailwind](https://tailwindcss.com/)
