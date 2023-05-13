npm install
npm run build
npm --prefix backend run sequelize -- db:seed:undo:all
node backend/psql-setup-script.js
node backend/sync-models.js
npm --prefix backend run sequelize -- db:seed:all
