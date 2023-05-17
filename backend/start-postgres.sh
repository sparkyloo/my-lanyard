# thanks to a friend's tutorial and advice on how to get Postgres running locally.

source .env

echo "cleaning up existing 'pg-lanyard' container"
docker rm -f pg-lanyard &> /dev/null

if [ ! "$?" == "0" ]; then
	echo "failed to delete existing container 'pg-lanyard'"
	exit 1
fi

echo "cleaning up existing 'pg-lanyard-data' volumne"
docker volume rm pg-laynard-data &> /dev/null

if [ ! "$?" == "0" ]; then
	echo "failed to delete existing volume 'pg-laynard-data'"
	exit 1
fi

echo "creating 'pg-lanyard' with 'pg-laynard-data'..."
docker run \
	--name pg-lanyard \
	-e POSTGRES_PASSWORD=password \
	-e PGDATA=/var/lib/postgresql/data/pgdata \
	-v pg-laynard-data:/var/lib/postgresql/data \
	-p 5432:5432 \
	-d \
	postgres:15-alpine -c search_path=icons,public &> /dev/null

if [ ! "$?" == "0" ]; then
	echo "failed to start container"
	exit 1
fi

# it takes a few seconds for the postgres server to initialize. 1 second is usually enough
sleep 1

echo "running 'psql-setup-script'..."
npx dotenv -- node psql-setup-script.js &> /dev/null

if [ ! "$?" == "0" ]; then
	echo "failed to do 'psql-setup-script'"
	exit 1
fi

# echo "reseting sequelize..."
# npx dotenv -- npm run sequelize -- db:seed:undo:all
# npx dotenv -- npm run sequelize -- db:migrate:undo:all
# npx dotenv -- npm run sequelize -- db:migrate

echo "running 'sync-models'..."
npx dotenv -- node sync-models.js &> /dev/null

if [ ! "$?" == "0" ]; then
	echo "failed to do sync-models"
	exit 1
fi

echo "seeding DB via sequelize..."
npx dotenv -- npm run sequelize -- db:seed:all

if [ ! "$?" == "0" ]; then
	echo "failed to do db:seed:all"
	exit 1
fi

echo "everything is ready!"
echo "connecting to the DB via psql"
echo

docker exec \
  -it \
  pg-lanyard \
  psql -h localhost -U postgres
