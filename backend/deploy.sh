STAGE=${1:-dev}
npm run build
NODE_ENV=$STAGE sls deploy --stage $STAGE