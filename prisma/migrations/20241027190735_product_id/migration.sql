-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "UserProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserProduct" ("id", "productId", "userId") SELECT "id", "productId", "userId" FROM "UserProduct";
DROP TABLE "UserProduct";
ALTER TABLE "new_UserProduct" RENAME TO "UserProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
