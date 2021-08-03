touch .env && 
echo "NODE_ENV=$1\nAPP_WELCOME=$2\nAPP_URL=$3\nHASH_SECRET_KEY=$4\nDB_NAME=$5\nDB_USER=$6\nDB_PASS=$7\nDB_HOST=$8\nDB_PORT=$9\nRUN_LOCAL=$10\nDOMAIN_CDN=$11 \n" > .env &&
npm run start:dev
