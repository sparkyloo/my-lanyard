npm install
npm run build
npm --prefix backend run sequelize -- db:seed:undo:all
npm --prefix backend run sequelize -- db:migrate:undo:all
npm --prefix backend run sequelize -- db:migrate
npm --prefix backend run sequelize -- db:seed:all
