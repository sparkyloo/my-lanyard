npm install
npm run build
npm --prefix backend run sequelize -- db:seed:undo:all
node backend/sync-models.js
npm --prefix backend run sequelize -- db:seed:all
