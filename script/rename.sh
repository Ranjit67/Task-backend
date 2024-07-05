
echo "Script started"

# set newFileName=%1.newName

# rem Rename the files
mv ./src/controller/$1.controller.ts  ./src/controller/$2.controller.ts
mv ./src/entities/$1.entities.ts  ./src/entities/$2.entities.ts
mv ./src/interfaces/$1.d.ts  ./src/interfaces/$2.d.ts
mv ./src/interfactor/$1.interfactor.ts  ./src/interfactor/$2.interfactor.ts
mv ./src/repositories/$1.repositories.ts  ./src/repositories/$2.repositories.ts
mv ./src/routes/$1.routes.ts  ./src/routes/$2.routes.ts
mv ./src/validations/$1.validations.ts  ./src/validations/$2.validations.ts

echo "Script completed"



