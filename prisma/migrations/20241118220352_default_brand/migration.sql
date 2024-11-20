-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_houseProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT 'no brand',
    "productId" TEXT NOT NULL,
    "houseId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minimum" INTEGER NOT NULL DEFAULT 0,
    "hasAlert" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "houseProduct_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_houseProduct" ("brand", "hasAlert", "houseId", "id", "minimum", "name", "productId", "quantity") SELECT "brand", "hasAlert", "houseId", "id", "minimum", "name", "productId", "quantity" FROM "houseProduct";
DROP TABLE "houseProduct";
ALTER TABLE "new_houseProduct" RENAME TO "houseProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
