

rm -rf ./src/controllers/$1.controller.ts
rm -rf ./src/models/$1.model.ts
rm -rf ./src/routes/$1.routes.ts
rm -rf ./src/types/$1.d.ts

echo $1" files deleted successfully."
# chmod +x scripts/create.sh
